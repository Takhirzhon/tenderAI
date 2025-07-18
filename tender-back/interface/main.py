import re
import streamlit as st
from datetime import datetime, timedelta
import json
import os
import sys
import time
import anthropic
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from io import BytesIO
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from core.score_matrix import AVK5Estimator, DocumentComplianceChecker, ProfitabilityAnalyzer
import xml.etree.ElementTree as ET
from core.uploader import handle_uploaded_tender
from core.downloader import download_prozorro_tenders
from core.data_extractor import extract_text_from_pdf
from core.analyze_link import analyze_tender_from_link
from core.claude_client import get_claude_client


# Initialize session state
if "analysis_results" not in st.session_state:
    st.session_state.analysis_results = []
if "tenders_downloaded" not in st.session_state:
    st.session_state.tenders_downloaded = []
if "excel_buffer" not in st.session_state:
    st.session_state.excel_buffer = None
if "analysis_attempted" not in st.session_state:
    st.session_state.analysis_attempted = False
if "company_resources" not in st.session_state:
    st.session_state.company_resources = {
        "workers": 10,
        "engineers": 2,
        "vehicles": 3,
        "current_projects": []
    }
if "document_vault" not in st.session_state:
    st.session_state.document_vault = DocumentComplianceChecker()

# Sidebar
st.sidebar.title("🛠️ Налаштування тендера")
tab = st.sidebar.radio("Navigation", ["📥 Завантаження даних", "🔍 Аналіз тендерів", "🏢 Профіль компанії", "📊 Оцінка тендерних пропозицій"])

keywords_option = st.sidebar.multiselect(
    "🔍 Select Tender Topics",
    ["IT", "Construction", "Medical Equipment", "Transport", "Education"],
    default=["Construction"]
)

days_range = st.sidebar.slider(
    "📅 Days Back to Search",
    min_value=1,
    max_value=60,
    value=30
)

# Main Page
st.title("📦 AI Оптимізатор тендерів")

if tab == "📥 Завантаження даних":

    handle_uploaded_tender()
    link = st.text_input("🔗 Введіть посилання на тендер")

    if link:
        try:
            result = analyze_tender_from_link(link)
            st.success("✅ Аналіз завершено!")
            st.json(result)
        except ValueError as ve:
            st.error(str(ve))
        except RuntimeError as re:
            st.error(str(re))


    st.header("📥 Завантажте тендерні пропозиції з ProZorro ")
    st.write("Якщо ви хочете аналізувати велику кількість випадкових тендерів")
    # Load topics from keywords.json dynamically
    with open("C:/Users/tashmatov/tender/data/keywords.json", "r", encoding="utf-8") as f:
        topic_keywords = json.load(f)
    topic_list = list(topic_keywords.keys())

    topic = st.selectbox("📚 Виберіть тему тендера", topic_list)
    num_tenders = st.slider("📦 Кількість тендерів для завантаження", min_value=5, max_value=100, value=20, step=5)
    days_back = st.slider("📅 Пошук тендерів за останні N днів", min_value=1, max_value=60, value=30)

    if st.button("🚀 Почати завантаження"):
        with st.spinner("Завантаження..."):
            tenders = download_prozorro_tenders(
                topic=topic,
                total_to_download=num_tenders,
                days_back=days_back
            )

        if tenders:
            st.success(f"✅ {len(tenders)} тендерів завантажено для теми '{topic}'")
            st.session_state["tenders_downloaded"] = tenders

            with st.expander("📄 Сумарна інформація про тендери"):
                st.json({
                    "topic": topic,
                    "keywords": topic_keywords[topic],
                    "total_downloaded": len(tenders)
                })

            st.download_button(
                label="📁 Завантажити метадані тендерів",
                data=json.dumps(tenders, ensure_ascii=False, indent=2),
                file_name=f"{topic.lower()}_tenders_summary.json",
                mime="application/json"
            )
        else:
            st.warning("❌ Не знайдено тендерів, що відповідають вашим критеріям.")

elif tab == "🔍 Аналіз тендерів":
    st.header("🔍 Аналіз тендерів")
    # Check for existing tender files
    def load_existing_tenders():
        tender_files = []
        tenders_dir = "../tenders"
        uploaded_dir = "../uploaded"
        if os.path.exists(tenders_dir):
            for filename in os.listdir(tenders_dir):
                if filename.startswith("ProZorro_") and filename.endswith(".json"):
                    tender_id = filename.replace("ProZorro_", "").replace(".json", "")
                    try:
                        with open(os.path.join(tenders_dir, filename), "r", encoding="utf-8") as f:
                            tender_data = json.load(f)
                            tender_files.append({
                                "id": tender_id,
                                "title": tender_data.get("title", "Без назви"),
                                "date": tender_data.get("dateModified", ""),
                                "budget": tender_data.get("value", {}).get("amount", 0),
                                "file": filename
                            })
                    except Exception as e:
                        st.warning(f"Error loading {filename}: {e}")
        if os.path.exists(uploaded_dir):
            for filename in os.listdir(uploaded_dir):
                if filename.endswith(".pdf"):
                    tender_files.append({
                        "id": filename.replace(".pdf", ""),
                        "title": filename.replace(".pdf", ""),
                        "date": "",
                        "budget": 0,
                        "file": filename
                    })
        return tender_files

    # Load tenders if missing
    if not st.session_state.tenders_downloaded:
        existing = load_existing_tenders()
        
        # Also include analyzed uploaded tenders from session state
        uploaded = []
        for result in st.session_state.analysis_results:
            if "tender_id" in result and "title" in result:
                uploaded.append({
                    "id": result["tender_id"],
                    "title": result["title"],
                    "date": result.get("deadline", ""),
                    "budget": result.get("budget", 0),
                    "file": result.get("Filename", "uploaded.pdf")
                })

        combined = existing + uploaded
        if combined:
            st.session_state.tenders_downloaded = combined
            st.success(f"✅ Loaded {len(combined)} tenders (existing + uploaded).")
        else:
            st.warning("⚠️ Не знайдено тендерних файлів.")
            st.stop()


    tender_options = {t['id']: t['title'] for t in st.session_state.tenders_downloaded}
    selected_tenders = st.multiselect(
        "Виберіть тендери для аналізу:",
        options=list(tender_options.keys()),
        format_func=lambda x: f"{x} - {tender_options[x][:50]}..."
    )

    if not selected_tenders:
        st.info("ℹ️ Будь ласка, виберіть принаймні один тендер для аналізу.")
        st.stop()

    client = get_claude_client()
    if not client:
        st.stop()

    status_text = st.empty()
    analyze_clicked = st.button("🔍 Аналіз вибраних тендерів", key="analyze_button")

    if analyze_clicked:
        st.session_state.analysis_attempted = True
        results = []
        progress_bar = st.progress(0)

        for i, tid in enumerate(selected_tenders):
            tender = next((t for t in st.session_state.tenders_downloaded if t['id'] == tid), None)
            if not tender:
                continue

            progress_bar.progress((i + 1) / len(selected_tenders))
            status_text.text(f"Analyzing {tid}...")

            if tender["file"].endswith(".json"):
                path = os.path.join("../tenders", tender["file"])
                if os.path.exists(path):
                    with open(path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    content = f"""
            Tender Title: {data.get('title', '')}
            Issuer: {data.get('procuringEntity', {}).get('name', '')}
            Location: {data.get('procuringEntity', {}).get('address', {}).get('locality', '')}, {data.get('procuringEntity', {}).get('address', {}).get('region', '')}
            Budget: {data.get('value', {}).get('amount', '')} {data.get('value', {}).get('currency', 'UAH')}
            Deadline: {data.get('tenderPeriod', {}).get('endDate', '')}
            Description: {data.get('description', '')}
            """.strip()
            elif tender["file"].endswith(".pdf"):
                path = os.path.join("../extracted/", tender["file"].replace(".pdf", ".txt"))
                if os.path.exists(path):
                    content = extract_text_from_pdf(path)
                else:
                    st.warning(f"⚠️ PDF not found: {path}")
                    continue
            else:
                st.warning(f"Unsupported file type: {tender['file']}")
                continue


            result = analyze_tender(content, client)
            if result:
                result["tender_id"] = tid
                result["Filename"] = f"{tid}.txt"
                results.append(result)
            time.sleep(1.5)

        st.session_state.analysis_results = results
        status_text.text("✅ Аналіз завершено.")
        progress_bar.empty()

        # Save to Excel
        if results:
            wb = Workbook()
            ws = wb.active
            if ws is None:
                ws = wb.create_sheet("Аналіз тендерів")
            else:
                ws.title = "Аналіз тендерів"
            ws, columns = format_excel(ws)
            for idx, res in enumerate(results, 2):
                row_data = [
                    res.get("title", "N/A"),
                    res.get("issuer", "N/A"),
                    res.get("deadline", "N/A"),
                    res.get("budget", "N/A"),
                    res.get("location", "N/A"),
                    res.get("project_type", "N/A"),
                    ", ".join(res.get("required_documents", [])),
                    "Yes" if res.get("avk5_required", False) else "No",
                    res.get("technical_specs", "N/A"),
                    res.get("payment_terms", "N/A"),
                    res.get("resource_requirements", "N/A"),
                    res.get("timeline_feasibility", "N/A"),
                    res.get("profitability", "N/A"),
                    res.get("Filename", "N/A")
                ]
                for col_idx, value in enumerate(row_data, 1):
                    cell = ws.cell(row=idx, column=col_idx, value=value)
                    cell.alignment = Alignment(wrap_text=True, vertical='top')
            buf = BytesIO()
            wb.save(buf)
            buf.seek(0)
            st.session_state.excel_buffer = buf

    # 🔁 Always restore results
    results = st.session_state.get("analysis_results", [])
    if not results:
        st.warning("⚠️ No analysis results found. Run analysis first.")
        st.stop()

    # 📋 SHOW ANALYSIS RESULTS
    st.subheader("Результати аналізу")
    for res in results:
        with st.expander(f"{res.get('title', 'Untitled')} - {res.get('tender_id', '')}"):
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Issuer", res.get("issuer", "N/A"))
                st.metric("Deadline", res.get("deadline", "N/A"))
                st.metric("Budget", res.get("budget", "N/A"))
                st.metric("Location", res.get("location", "N/A"))
                st.metric("Project Type", res.get("project_type", "N/A"))
                st.metric("PC AVK5 Required", "✅ Yes" if res.get("avk5_required") else "❌ No")
            with col2:
                st.subheader("Required Documents")
                for doc in res.get("required_documents", []):
                    st.write(f"- {doc}")
                st.subheader("Technical Specifications")
                st.info(res.get("technical_specs", "No technical specs"))
                st.subheader("Viability")
                st.metric("Timeline Feasibility", res.get("timeline_feasibility", "N/A"))
                st.metric("Profitability", res.get("profitability", "N/A"))

    if st.session_state.excel_buffer:
        st.download_button(
            label="📊 Завантажити повний аналіз (Excel)",
            data=st.session_state.excel_buffer,
            file_name="tender_analysis.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            key="excel_download_button"
        )

elif tab == "🏢 Профіль компанії":
    st.header("🏢 Профіль компанії")
    
    st.subheader("Ресурси компанії")
    col1, col2, col3 = st.columns(3)
    workers = col1.number_input("Кількість робітників", 
                               value=st.session_state.company_resources["workers"],
                               min_value=0, step=1)
    engineers = col2.number_input("Кількість інженерів", 
                                 value=st.session_state.company_resources["engineers"],
                                 min_value=0, step=1)
    vehicles = col3.number_input("Кількість транспортних засобів", 
                                value=st.session_state.company_resources["vehicles"],
                                min_value=0, step=1)
    
    # Current projects
    st.subheader("Поточні проекти")
    projects = st.session_state.company_resources["current_projects"]
    for i, project in enumerate(projects):
        col1, col2, col3 = st.columns([3, 2, 1])
        project_name = col1.text_input(f"Назва проекту {i+1}", value=project["name"])
        duration = col2.number_input(f"Тривалість (днів)", value=project["duration"], min_value=1)
        if col3.button("❌", key=f"del_proj_{i}"):
            projects.pop(i)
            st.rerun()
    
    if st.button("➕ Додати проект"):
        projects.append({"name": "Новий проект", "duration": 30})
        st.rerun()
    
    # Document vault
    st.subheader("Сховище документів")
    st.write("Завантажте документи компанії для перевірки відповідності")
    
    doc_name = st.text_input("Назва документа")
    doc_type = st.text_input("Тип документа")
    validity = st.date_input("Дата дії")
    uploaded_file = st.file_uploader("Завантажити документ")
    
    if st.button("Додати до сховища") and uploaded_file:
        # Save file
        os.makedirs("../data/documents", exist_ok=True)
        file_path = f"../data/documents/{uploaded_file.name}"
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        
        # Add to vault
        st.session_state.document_vault.add_document(
            doc_name, doc_type, validity.isoformat(), file_path
        )
        st.success(f"✅ Документ '{doc_name}' додано до сховища!")
    
    # Save resources
    if st.button("💾 Зберегти профіль компанії"):
        st.session_state.company_resources = {
            "workers": workers,
            "engineers": engineers,
            "vehicles": vehicles,
            "current_projects": projects
        }
        st.success("Профіль компанії оновлено!")

elif tab == "📊 Оцінка тендерних пропозицій":
    st.header("📊 Оцінка тендерних пропозицій")

    if not st.session_state.analysis_results:
        st.warning("⚠️ Не доступний аналіз тендерів. Будь ласка, аналізуйте тендери спочатку.")
        st.stop()

    avk5_data = json.load(open("../data/avk5_standards.json", "r", encoding="utf-8"))
    compliance = st.session_state.document_vault
    profitability = ProfitabilityAnalyzer(AVK5Estimator())

    tender_options = {r["tender_id"]: r["title"] for r in st.session_state.analysis_results}
    selected_tender = st.selectbox("Виберіть тендер для оцінки:", options=list(tender_options.keys()), format_func=lambda x: f"{tender_options[x][:50]}...")

    if not selected_tender:
        st.stop()

    tender_data = next(r for r in st.session_state.analysis_results if r["tender_id"] == selected_tender)

    # ---------------------- 📄 Document Compliance ----------------------
    with st.expander("📄 Перевірка відповідності документа", expanded=True):
        if tender_data.get("required_documents"):
            doc_report = compliance.check_compliance(tender_data["required_documents"])
            col1, col2 = st.columns([1, 3])
            col1.metric("Рівень відповідності", f"{doc_report['compliance_score']*100:.1f}%")
            col2.metric("Статус", "✅ Відповідає" if doc_report["is_compliant"] else "❌ Не відповідає")

            st.subheader("Статус документів")
            for doc in tender_data["required_documents"]:
                status = "✅ Доступний" if doc in doc_report["available_documents"] else "❌ Відсутній"
                st.write(f"{status} - {doc}")
        else:
            st.info("Немає документів, що вказані в тендері.")

    # ---------------------- 🧱 AVK5 Material Cost Estimation ----------------------
    st.subheader("🧱 Додайте власні матеріали для оцінки AVK5")

    # Prepare dropdown materials
    material_options = []
    category_map = {}
    for cat, items in avk5_data.items():
        if isinstance(items, dict):
            for spec in items:
                material_options.append(f"{spec} ({cat})")
                category_map[spec] = cat

    if "custom_materials" not in st.session_state:
        st.session_state.custom_materials = []

    selected_material = st.selectbox("Виберіть матеріал", material_options)
    mat_spec = selected_material.split(" (")[0]
    mat_cat = category_map[mat_spec]
    unit = avk5_data[mat_cat][mat_spec]["unit"]
    default_price = avk5_data[mat_cat][mat_spec]["price"]

    with st.form("material_form"):
        col1, col2, col3 = st.columns(3)
        qty = col1.number_input("Кількість", min_value=0.0, step=0.1, key="mat_qty")
        price = col2.number_input("Ціна за одиницю (UAH)", value=float(default_price), step=100.0, key="mat_price")
        col3.markdown(f"💡 Одиниця виміру: **{unit}**")
        if st.form_submit_button("➕ Додати матеріал"):
            if qty > 0:
                st.session_state.custom_materials.append({
                    "category": mat_cat,
                    "specification": mat_spec,
                    "quantity": qty,
                    "unit_price": price,
                    "total": qty * price
                })
                st.success(f"✅ {mat_spec} додано!")

    if st.session_state.custom_materials:
        st.subheader("📦 Поточні матеріали")
        total = 0
        for m in st.session_state.custom_materials:
            st.write(f"- {m['specification']} ({m['category']}): {m['quantity']} × {m['unit_price']} = {m['total']:.2f} UAH")
            total += m["total"]
        st.markdown(f"### 💰 Загальна вартість матеріалів: **{total:,.2f} UAH**")

        # Export to Excel
        if st.button("📥 Завантажити вартість матеріалів (Excel)"):
            wb = Workbook()
            ws = wb.active
            if ws is None:
                ws = wb.create_sheet(title="Власні матеріали")
            else:
                ws.title = "Власні матеріали"
            headers = ["Category", "Specification", "Quantity", "Unit Price", "Total"]
            for col_num, header in enumerate(headers, 1):
                cell = ws.cell(row=1, column=col_num, value=header)
                cell.font = Font(bold=True)
                ws.column_dimensions[get_column_letter(col_num)].width = 20
            for i, m in enumerate(st.session_state.custom_materials, 2):
                ws.cell(row=i, column=1, value=m["category"])
                ws.cell(row=i, column=2, value=m["specification"])
                ws.cell(row=i, column=3, value=m["quantity"])
                ws.cell(row=i, column=4, value=m["unit_price"])
                ws.cell(row=i, column=5, value=m["total"])
            ws.cell(row=len(st.session_state.custom_materials) + 2, column=4, value="Total:")
            ws.cell(row=len(st.session_state.custom_materials) + 2, column=5, value=total)

            excel_buffer = BytesIO()
            wb.save(excel_buffer)
            excel_buffer.seek(0)
            st.download_button("📥 Завантажити оцінку AVK5", data=excel_buffer, file_name=f"avk5_materials_{selected_tender}.xlsx")

    # ---------------------- 💰 Profitability Analysis ----------------------
    with st.expander("💰 Аналіз прибутковості", expanded=True):
        def extract_resources(text):
            import re
            resources = {"workers": 0, "engineers": 0, "vehicles": 0}
            patterns = {
                "workers": r"(\d+)\s*(workers|laborers|people)",
                "engineers": r"(\d+)\s*(engineers)",
                "vehicles": r"(\d+)\s*(vehicles|trucks|cars)"
            }
            for key, pattern in patterns.items():
                found = re.search(pattern, text, re.IGNORECASE)
                if found:
                    resources[key] = int(found.group(1))
            return resources

        def estimate_complexity(text):
            text = text.lower()
            if any(w in text for w in ["automation", "bim", "hvac", "deep foundation"]): return 8
            if any(w in text for w in ["roof", "paving", "electrical"]): return 5
            if any(w in text for w in ["painting", "doors"]): return 3
            return 4

        def safe_budget(budget_raw):
            try:
                return float(budget_raw.split()[0].replace(",", ""))
            except:
                return 0.0

        auto_resource_req = extract_resources(tender_data.get("resource_requirements", ""))
        auto_complexity = estimate_complexity(tender_data.get("technical_specs", ""))
        auto_budget = safe_budget(tender_data.get("budget", "0"))
        # Calculate total cost from AVK5 custom materials if available
        custom_materials = st.session_state.get("custom_materials", [])
        estimated_cost = 0

        if custom_materials:
            estimated_cost = sum(m["total"] for m in custom_materials)
            st.markdown(f"💸 **Оцінена вартість з власних матеріалів**: `{estimated_cost:,.2f} UAH`")

        tender = {
            "title": tender_data.get("title", ""),
            "budget": auto_budget,
            "resource_requirements": auto_resource_req,
            "estimated_cost": estimated_cost,
            "timeline": {
                "duration_days": 90,
                "start_date": "2025-09-01"
            },
            "complexity": auto_complexity,
            "payment_terms": tender_data.get("payment_terms", "standard").lower(),
            "has_penalties": False,
            "competitors": 3,
            "required_docs": tender_data.get("required_documents", [])
        }

        company = st.session_state.company_resources
        analysis = profitability.analyze_tender(tender, company)

        col1, col2, col3 = st.columns(3)
        col1.metric("Рівень ROI", f"{analysis['roi_score']:.1f}/100")
        col2.metric("Рівень прибутковості", f"{analysis['profit_margin']*100:.1f}%")
        col3.metric("Рекомендація", analysis["recommendation"])

        st.subheader("Аналіз дефіциту ресурсів")
        st.subheader("📈 Фінансовий аналіз")
        st.markdown(f"- **Вартість тендера**: {analysis['tender_value']:,.2f} UAH")
        st.markdown(f"- **Оцінена вартість**: {analysis['estimated_cost']:,.2f} UAH")
        st.markdown(f"- **Валовий прибуток**: {analysis['gross_profit']:,.2f} UAH")

        st.subheader("📦 Аналіз витрат")
        for cat, val in analysis.get("cost_breakdown", {}).items():
            if isinstance(val, (int, float)):
                st.write(f"- {cat}: {val:,.2f} UAH")
            elif isinstance(val, list):
                st.write(f"- {cat}:")
                for item in val:
                    st.write(f"    {item}")
            else:
                st.write(f"- {cat}: {val}")

        st.subheader("⏱️ Аналіз можливості виконання")
        st.info(f"{analysis.get('timeline_feasibility', 'N/A')}")

        st.subheader("⚠️ Ризики")
        for factor in analysis.get("risk_factors", []):
            st.warning(f"- {factor}")

        if analysis["resource_gap"].get("gap_analysis"):
            for resource, data in analysis["resource_gap"]["gap_analysis"].items():
                gap_percent = max(0, min(1, data["gap_percent"]))
                st.progress(1 - gap_percent, text=f"{resource}: {data['available']}/{data['required']} ({data['gap']} gap)")
        else:
            st.info("Немає ресурсних вимог.")

        # Export Evaluation to Excel
        if st.button("📥 Завантажити звіт про оцінку (Excel)"):
            wb = Workbook()
            ws = wb.active
            if ws is None:
                ws = wb.create_sheet(title="Оцінка тендера")
            else:
                ws.title = "Оцінка тендера"
                
            ws.append(["Назва тендера", tender["title"]])
            ws.append(["Бюджет", tender["budget"]])
            ws.append(["Тривалість (днів)", tender["timeline"]["duration_days"]])
            ws.append(["Складність", tender["complexity"]])
            ws.append(["Умови оплати", tender["payment_terms"]])
            ws.append(["Наявність штрафів", tender["has_penalties"]])
            ws.append(["Конкуренти", tender["competitors"]])
            ws.append(["Рівень ROI", analysis["roi_score"]])
            ws.append(["Рівень прибутковості", analysis["profit_margin"]])
            ws.append(["Рекомендація", analysis["recommendation"]])
            ws.append([])

            # Financial Breakdown
            ws.append(["📈 Фінансовий аналіз"])
            ws.append(["Вартість тендера", analysis["tender_value"]])
            ws.append(["Оцінена вартість", analysis["estimated_cost"]])
            ws.append(["Валовий прибуток", analysis["gross_profit"]])
            ws.append([])

            # Cost Breakdown
            ws.append(["📦 Аналіз витрат"])
            ws.append(["Категорія", "Сума (UAH)"])
            for cat, val in analysis.get("cost_breakdown", {}).items():
                ws.append([cat, val])
            ws.append([])

            # Timeline Feasibility
            ws.append(["⏱️ Аналіз можливості виконання", analysis.get("timeline_feasibility", "N/A")])
            ws.append([])

            # Risk Factors
            ws.append(["⚠️ Ризики"])
            for risk in analysis.get("risk_factors", []):
                ws.append([risk])
            ws.append([])

            # Resource Gaps
            ws.append(["Ресурс", "Потрібно", "Наявність", "Дефіцит", "Рівень дефіциту"])
            for resource, data in analysis["resource_gap"]["gap_analysis"].items():
                ws.append([
                    resource,
                    data["required"],
                    data["available"],
                    data["gap"],
                    f"{data['gap_percent']*100:.1f}%"
                ])

            # Export
            buffer = BytesIO()
            wb.save(buffer)
            buffer.seek(0)

            st.download_button(
                label="📊 Завантажити звіт про оцінку (Excel)",
                data=buffer,
                file_name=f"tender_evaluation_{selected_tender}.xlsx",
                mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
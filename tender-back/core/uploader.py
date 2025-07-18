import os
import json
import streamlit as st

UPLOAD_DIR = "../uploaded"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def handle_uploaded_tender():
    st.markdown("---")
    st.subheader("📤 Завантажте власні тендерні файли ProZorro")

    uploaded_file = st.file_uploader("Завантажте JSON або PDF файл", type=["json", "pdf"])

    if uploaded_file is not None:
        filename = uploaded_file.name
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Save the uploaded file
        with open(file_path, "wb") as f:
            f.write(uploaded_file.read())

        st.success(f"✅ Завантажено і збережено як {filename}")

        if filename.endswith(".json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                tender_id = os.path.splitext(filename)[0]
                st.session_state.tenders_downloaded.append({
                    "id": tender_id,
                    "title": data.get("title", "Без назви"),
                    "date": data.get("dateModified", ""),
                    "budget": data.get("value", {}).get("amount", 0),
                    "file": filename
                })
                st.success("✅ JSON тендер додано до списку аналізу.")
            except Exception as e:
                st.error(f"❌ Не вдалося розпарсити завантажений JSON файл: {e}")
        else:
            st.info("📄 PDF тендер завантажено. Підтримка PDF аналізу буде додана в майбутньому.")

import re
import json
import requests
import os
import anthropic
import streamlit as st

def get_claude_client():
    api_key = os.getenv("CLAUDE_API_KEY")
    if not api_key:
        st.error("❌ Ключ API Claude не знайдено у файлі .env")
        return None
    return anthropic.Anthropic(api_key=api_key)

# Main analyzer function
def analyze_tender_from_link(link: str) -> dict:
    """
    Given a ProZorro tender URL, download its JSON and analyze the content using Claude.
    Returns extracted structured info as a dictionary.
    """
    # Extract tender ID
    match = re.search(r"(UA-\d{4}-\d{2}-\d{2}-\d{5,8}-[a-z0-9]+)", link)
    if not match:
        raise ValueError("❌ Не вдалося розпізнати ID тендера з посилання.")

    tender_id = match.group(1)
    api_url = f"https://public.api.openprocurement.org/api/2.5/tender/{tender_id}"

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        tender_data = response.json()["data"]
    except Exception as e:
        raise RuntimeError(f"❌ Не вдалося отримати тендер з API: {e}")

    # Build tender text
    text = f"""
Назва тендеру: {tender_data.get('title', '')}
Замовник: {tender_data.get('procuringEntity', {}).get('name', '')}
Опис: {tender_data.get('description', '')}
Місце реалізації: {tender_data.get('procuringEntity', {}).get('address', {}).get('locality', '')}, {tender_data.get('procuringEntity', {}).get('address', {}).get('region', '')}
Очікувана вартість: {tender_data.get('value', {}).get('amount', '')} {tender_data.get('value', {}).get('currency', 'UAH')}
Кінцевий термін: {tender_data.get('tenderPeriod', {}).get('endDate', '')}
"""

    # Call Claude for analysis
    client = get_claude_client()
    prompt = f"""
Ви — досвідчений аналітик державних закупівель в Україні. Проаналізуйте наведений нижче тендер українською мовою. Визначте ключові параметри та поверніть **тільки валідний JSON-об'єкт** з наступними ключами англійською мовою:

- title (string): Повна назва тендеру.
- issuer (string): Назва замовника або організатора закупівлі.
- deadline (string): Дата та час крайнього терміну подання пропозицій.
- budget (string): Очікувана вартість або гранична сума контракту.
- location (string): Місце реалізації робіт або надання послуг.
- project_type (string): Тип закупівлі (наприклад: будівництво, ремонт, ІТ-послуги, постачання обладнання).
- required_documents (list of strings): Усі документи, які прямо або опосередковано вимагаються для участі або кваліфікації. Наприклад: витяг з ЄДР, тендерна гарантія, AVK-5 кошторис, довідка про досвід, документи на техніку, декларація про персонал. Звертайте увагу на розділи з назвами “Кваліфікаційні вимоги”, “Необхідні документи”, “Перелік документів”.
- avk5_required (boolean): Чи прямо вказано, що потрібно подати розрахунок у форматі AVK-5 (true або false).
- technical_specs (string): Узагальнення технічних вимог: обсяг робіт, очікувані стандарти, матеріали, техніка. Орієнтуйтесь на розділи “Технічна специфікація”, “Технічне завдання”, “Опис предмету закупівлі”.
- payment_terms (string): Умови оплати — аванс, поетапна оплата, після завершення тощо.
- resource_requirements (string): Які ресурси або матеріали має надати учасник: персонал, інженери, техніка, матеріали, ПММ тощо. Звертайте увагу на “Обсяг робіт”, “Ресурсна відомість”, “Умови виконання”.
- timeline_feasibility (string): Коротка оцінка, чи реалістичні строки виконання. Варіанти: “реалістичні”, “обмежені, але можливі”, “нереалістичні”.
- profitability (string): Чи є проєкт прибутковим з урахуванням бюджету, технічних вимог та ресурсів. Наприклад: “прибутковий”, “ризикований”, “збитковий” — з коротким поясненням.

📌 Не додавайте пояснень чи коментарів. Поверніть лише валідний JSON. Якщо дані відсутні — залишайте поле порожнім або оцінюйте обережно.

Tender Content:
\"\"\"{text[:15000]}\"\"\"
"""

    try:
        completion = client.messages.create( # type: ignore
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            temperature=0.0,
            system="Ви — аналітик державних закупівель. Поверніть тільки валідний JSON.",
            messages=[{"role": "user", "content": prompt}]
        )

        if completion.content:
            result_text = ''.join(block.text for block in completion.content if hasattr(block, 'text')) # type: ignore
            match = re.search(r'({.*})', result_text, re.DOTALL)
            return json.loads(match.group(1)) if match else {}
    except Exception as e:
        raise RuntimeError(f"❌ Помилка Claude: {e}")

    return {}

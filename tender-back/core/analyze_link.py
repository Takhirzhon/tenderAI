import re
import json
import requests
from core.claude_client import get_claude_client
from anthropic.types import TextBlock

def analyze_tender_from_hash(tender_hash: str) -> dict:
    """
    Given only the 32‐character ProZorro hash, fetch the tender data
    from the public API v2.5 and return Claude’s JSON analysis.
    """
    # 1) Validate the hash format (32 hex characters)
    if not re.fullmatch(r"[a-f0-9]{32}", tender_hash):
        raise ValueError("❌ Invalid tender hash format. Expected 32 hex characters.")
    
    # 2) Build the v2.5 API URL
    api_url = f"https://public-api.prozorro.gov.ua/api/2.5/tenders/{tender_hash}"
    
    # 3) Fetch tender data
    try:
        resp = requests.get(api_url)
        resp.raise_for_status()
        tender_data = resp.json().get("data", {})
    except Exception as e:
        raise RuntimeError(f"❌ Failed to fetch tender data: {e}")
    
    # 4) Prepare the text snippet for the prompt
    text = f"""
Назва тендеру: {tender_data.get('title', '')}
Замовник: {tender_data.get('procuringEntity', {}).get('name', '')}
Опис: {tender_data.get('description', '')}
Місце реалізації: {tender_data.get('procuringEntity', {}).get('address', {}).get('locality', '')}, {tender_data.get('procuringEntity', {}).get('address', {}).get('region', '')}
Очікувана вартість: {tender_data.get('value', {}).get('amount', '')} {tender_data.get('value', {}).get('currency', 'UAH')}
Кінцевий термін: {tender_data.get('tenderPeriod', {}).get('endDate', '')}
"""
    
    # 5) Build Claude prompt (same as before)
    prompt = f"""
Ви — експерт з державних закупівель в Україні. На основі наданого JSON-вмісту тендеру з системи ProZorro проаналізуйте та витягніть відповідні поля. Якщо деяка інформація відсутня, заповніть лише ті поля, які можна визначити. Якщо можливо — зробіть обґрунтовані висновки щодо строків та прибутковості.

Поверніть **лише коректний JSON-об'єкт** з такими ключами:

- title (string): Повна назва тендеру.
- issuer (string): Назва замовника або організатора закупівлі.
- deadline (string): Дедлайн подачі пропозицій або кінцева дата.
- budget (string): Очікувана вартість закупівлі або гранична сума контракту.
- location (string): Місце реалізації або виконання робіт.
- project_type (string): Тип проєкту (наприклад: будівництво, IT-послуги, ремонт).
- required_documents (list of strings): Усі документи, що вимагаються для участі або кваліфікації. Орієнтуйтесь на поля, де згадуються: “Кваліфікаційні вимоги”, “Перелік документів” тощо.
- avk5_required (boolean): Чи прямо зазначено, що потрібно надати кошторис у форматі АВК-5.
- technical_specs (string): Стислий виклад технічного завдання — що потрібно зробити, які матеріали чи стандарти використати.
- payment_terms (string): Умови оплати — аванс, поетапна, після виконання, строки та порядок.
- resource_requirements (string): Які ресурси чи матеріали має надати підрядник: персонал, техніка, матеріали тощо.
- timeline_feasibility (string): Чи строки виконання виглядають реалістичними: “реалістичні”, “обмежені, але можливі”, “нереалістичні”.
- profitability (string): Чи участь у тендері виглядає прибутковою: “прибутковий”, “ризикований”, “збитковий” — з коротким поясненням.

❗Поверніть **тільки** JSON-об’єкт без жодних коментарів чи пояснень.

Tender Content:
\"\"\"{text[:15000]}\"\"\"
"""
    
    # 6) Call Claude
    client = get_claude_client()
    if client is None:
        raise RuntimeError("❌ Claude API key is missing.")
    
    try:
        completion = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            temperature=0.0,
            system="Ви — аналітик державних закупівель. Поверніть тільки валідний JSON.",
            messages=[{"role": "user", "content": prompt}]
        )
        # Extract JSON blob from Claude’s reply
        raw_parts = []
        if completion.content:
            for block in completion.content:
                if isinstance(block, TextBlock):
                    raw_parts.append(block.text)
        raw = "".join(raw_parts)
        match = re.search(r"(\{.*\})", raw, re.DOTALL)
        return json.loads(match.group(1)) if match else {}
    except Exception as e:
        raise RuntimeError(f"❌ Claude error: {e}")

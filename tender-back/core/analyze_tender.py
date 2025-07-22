import json
import re
import streamlit as st



def analyze_tender(text, client):
    prompt = f"""
Ви — експерт з державних закупівель в Україні. Проаналізуйте наведений нижче текст тендеру та всі додаткові файли, які завантажив користувач (наприклад «Додаток 1», списки необхідних документів, технічні специфікації тощо). Поверніть тільки валідний JSON-об'єкт з такими ключами:
- title (string): Повна назва тендеру.
- issuer (string): Назва замовника або організатора закупівлі.
- deadline (string): Дедлайн подачі пропозицій або кінцева дата.
- budget (string): Очікувана вартість закупівлі або гранична сума контракту.
- location (string): Місце реалізації або виконання робіт.
- project_type (string): Тип проєкту (наприклад: будівництво, IT‑послуги, ремонт).
- required_documents (list of strings): Укажіть усі документи, які вимагаються для участі або кваліфікації — беріть інформацію як із основного тексту, так і зі всіх завантажених файлів.
- avk5_required (boolean): Чи прямо зазначена вимога подати кошторис у форматі АВК‑5 (true або false).
- technical_specs (string): Стисле резюме технічних вимог — що потрібно виконати, які матеріали, стандарти, обладнання. Орієнтуйтесь на розділи та відповідні вкладені файли з назвами “Технічна специфікація”, “Технічне завдання”, “Опис предмету закупівлі” тощо.
- pyment_terms (string): Умови оплати — аванс, поетапна, після виконання, строки та порядок.
- resource_requirements (string): Які ресурси та матеріали повинен надати підрядник: робітники, інженери, техніка, будматеріали, ПММ тощо. Беріть дані з розділів “Обсяг робіт”, “Вимоги до ресурсів”, а також зі всіх доданих файлів “Відомість ресурсів” тощо.
- timeline_feasibility (string): Чи виглядають строки виконання реалістичними (наприклад: “реалістичні”, “обмежені, але можливі”, “нереалістичні”).
- profitability (string): Чи виглядає участь у тендері прибутковою з урахуванням бюджету, обсягу робіт та витрат. (Наприклад: “прибутковий”, “ризикований”, “збитковий” — з коротким поясненням.)

❗Якщо виявите в завантажених файлах додаткові релевантні поля (наприклад “compliance_requirements”, “subcontractor_rules” тощо), додайте відповідні ключі в JSON. Не додавайте ніяких пояснень або коментарів — поверніть лише коректний JSON.

Tender Text:
\"\"\"{text[:15000]}\"\"\"
"""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            temperature=0.0,
            system="...",
            messages=[{"role": "user", "content": prompt}]
        )
        if response.content:
            result = ''.join(block.text for block in response.content if hasattr(block, 'text'))
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                match = re.search(r'({.*})', result, re.DOTALL)
                if match:
                    return json.loads(match.group(1))
        return {"error": "Claude returned invalid JSON."}
    except Exception as e:
        return {"error": str(e)}

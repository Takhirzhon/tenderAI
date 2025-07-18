import re
import requests
PROZORRO_API_URL = "https://public.api.openprocurement.org/api/2.3/tender"

link = "https://prozorro.gov.ua/tender/UA-2025-07-04-004169-a?oldVersion=true"
match = re.search(r"/(UA-\d{4}-\d{2}-\d{2}-\d{5,8}-[a-z])", link)
if not match:
    raise ValueError("❌ Не вдалося розпізнати ID тендера з посилання.")
print(match.group(1))

tender_url = f"{PROZORRO_API_URL}/{match.group(1)}"
tender_response = requests.get(tender_url)
print(tender_response.json())

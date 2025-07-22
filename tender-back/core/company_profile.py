import json
import os
from datetime import datetime

DEFAULT_PATH = "../data/company_profile.json"


class CompanyProfile:
    def __init__(self, profile_path=DEFAULT_PATH):
        self.profile_path = profile_path
        self.profile = self.load_profile()

    def load_profile(self):
        if os.path.exists(self.profile_path):
            with open(self.profile_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "company_name": "",
            "registration_number": "",
            "edrpou_code": "",
            "tax_certificate": "",
            "company_director": "",
            "legal_address": "",
            "email": "",
            "phone": "",
            "bank_account": {
                "account_number": "",
                "bank_name": "",
                "mfo": "",
                "iban": "",
                "swift": "",
            },
            "vat_status": "Yes",
            "financials": {
                "last_year_revenue": "",
                "net_profit": "",
                "avg_monthly_turnover": "",
                "balance_sheet_link": "",
            },
            "certifications": [],
            "licenses": [],
            "key_personnel": [],
            "last_updated": datetime.now().isoformat(),
        }

    def save_profile(self):
        os.makedirs(os.path.dirname(self.profile_path), exist_ok=True)
        with open(self.profile_path, "w", encoding="utf-8") as f:
            json.dump(self.profile, f, indent=2, ensure_ascii=False)

    def update_profile(self, new_data: dict):
        self.profile.update(new_data)
        self.profile["last_updated"] = datetime.now().isoformat()
        self.save_profile()

    def get_profile(self):
        return self.profile

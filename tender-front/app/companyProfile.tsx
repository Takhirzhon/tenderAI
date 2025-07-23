"use client"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function CompanyProfilePage() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/get_company_profile`)
      const data = await res.json()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/update_company_profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    })
    setEditing(false)
  }

  if (loading || !profile) return <p className="text-center text-lg py-10">{t("loading")}</p>

  const input = (label: string, key: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t(label)}</label>
      <input
        className={`border w-full rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 ${editing ? "border-blue-400 focus:ring-blue-300" : "bg-gray-100 border-gray-200"
          }`}
        value={profile[key] || ""}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
        disabled={!editing}
      />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">{t("company_profile.title")}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {input("company_profile.company_name", "company_name")}
          {input("company_profile.registration_number", "registration_number")}
          {input("company_profile.edrpou", "edrpou_code")}
          {input("company_profile.tax_certificate", "tax_certificate")}
          {input("company_profile.director", "company_director")}
          {input("company_profile.legal_address", "legal_address")}
          {input("company_profile.email", "email")}
          {input("company_profile.phone", "phone")}
        </div>

        <hr className="my-6 border-t" />

        <h3 className="text-xl font-semibold text-gray-800">{t("company_profile.financial_info")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {input("company_profile.last_year_revenue", "financials.last_year_revenue")}
          {input("company_profile.net_profit", "financials.net_profit")}
          {input("company_profile.avg_monthly_turnover", "financials.avg_monthly_turnover")}
          {input("company_profile.balance_sheet_link", "financials.balance_sheet_link")}
        </div>

        <div className="pt-4 flex justify-end">
          {editing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              {t("common.save")}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              {t("common.edit")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

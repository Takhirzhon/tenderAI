"use client"

import { useEffect, useState } from "react"

export default function CompanyProfilePage() {
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

  if (loading || !profile) return <p className="text-center text-lg py-10">🔄 Завантаження…</p>

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">🏢 Профіль компанії</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Назва компанії", "company_name"],
            ["Реєстраційний номер", "registration_number"],
            ["ЄДРПОУ", "edrpou_code"],
            ["ІПН / Податковий сертифікат", "tax_certificate"]
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                className={`border w-full rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 ${
                  editing ? "border-blue-400 focus:ring-blue-300" : "bg-gray-100 border-gray-200"
                }`}
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                disabled={!editing}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">💳 Рахунок IBAN</label>
            <input
              className={`border w-full rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 ${
                editing ? "border-blue-400 focus:ring-blue-300" : "bg-gray-100 border-gray-200"
              }`}
              value={profile.bank_account?.iban || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bank_account: { ...profile.bank_account, iban: e.target.value }
                })
              }
              disabled={!editing}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          {editing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              💾 Зберегти
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              ✏️ Редагувати
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

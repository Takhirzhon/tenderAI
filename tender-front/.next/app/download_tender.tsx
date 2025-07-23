import React, { useState } from "react"
import { useTranslation } from "react-i18next"

export default function DownloadTender() {
  const { t } = useTranslation()

  const [topic, setTopic] = useState("Construction")
  const [amount, setAmount] = useState(10)
  const [daysBack, setDaysBack] = useState(30)
  const [status, setStatus] = useState("")
  const [tenders, setTenders] = useState<any[]>([])

  const handleDownload = async () => {
    setStatus(t("downloader.status_downloading"))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/download_prozorro_tenders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          total_to_download: amount,
          days_back: daysBack
        })
      })

      const data = await response.json()
      setTenders(data.tenders || [])
      setStatus(t("downloader.status_success", { count: data.tenders?.length || 0 }))
    } catch (err) {
      console.error(err)
      setStatus(t("downloader.status_error"))
    }
    console.log("🔗 Using API:", process.env.NEXT_PUBLIC_API_BASE)
  }

  return (
    <div className="space-y-4">
      <label className="block">
        {t("downloader.topic")}
        <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border rounded">
          <option value="Construction">{t("downloader.options.construction")}</option>
          <option value="IT">{t("downloader.options.it")}</option>
          <option value="Medical Equipment">{t("downloader.options.medical")}</option>
        </select>
      </label>

      <label className="block">
        {t("downloader.num_tenders")}
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded" />
      </label>

      <label className="block">
        {t("downloader.days_back")}
        <input type="number" value={daysBack} onChange={e => setDaysBack(Number(e.target.value))} className="w-full p-2 border rounded" />
      </label>

      <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        📥 {t("downloader.download_btn")}
      </button>

      <p className="text-sm">{status}</p>

      {tenders.length > 0 && (
        <ul className="max-h-40 overflow-y-auto list-disc pl-5 text-sm">
          {tenders.map((t, idx) => <li key={idx}>{t.title || t("downloader.untitled")}</li>)}
        </ul>
      )}
    </div>
  )
}

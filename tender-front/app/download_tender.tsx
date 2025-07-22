import React, { useState } from "react"

export default function DownloadTender() {
  const [topic, setTopic] = useState("Construction")
  const [amount, setAmount] = useState(10)
  const [daysBack, setDaysBack] = useState(30)
  const [status, setStatus] = useState("")
  const [tenders, setTenders] = useState<any[]>([])

  const handleDownload = async () => {
    setStatus("⏳ Downloading...")

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
      setStatus(`✅ Downloaded ${data.tenders?.length || 0} tenders.`)
    } catch (err) {
      console.error(err)
      setStatus("❌ Error downloading")
    }
    console.log("🔗 Using API:", process.env.NEXT_PUBLIC_API_BASE)

  }

  return (
    <div className="space-y-4">
      <label className="block">
        Topic:
        <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border rounded">
          <option value="Construction">Construction</option>
          <option value="IT">IT</option>
          <option value="Medical Equipment">Medical Equipment</option>
        </select>
      </label>

      <label className="block">
        Number of Tenders:
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded" />
      </label>

      <label className="block">
        Days Back:
        <input type="number" value={daysBack} onChange={e => setDaysBack(Number(e.target.value))} className="w-full p-2 border rounded" />
      </label>

      <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        📥 Download
      </button>

      <p className="text-sm">{status}</p>

      {tenders.length > 0 && (
        <ul className="max-h-40 overflow-y-auto list-disc pl-5 text-sm">
          {tenders.map((t, idx) => <li key={idx}>{t.title || "Без назви"}</li>)}
        </ul>
      )}
    </div>
  )
}

import React, { useState } from "react"

export default function UploadTender() {
  const [file, setFile] = useState<File | null>(null)
  const [loadingMsg, setLoadingMsg] = useState("Waiting to start...")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const messages = [
    "📡 Fetching data...",
    "🧠 Analyzing tender specs...",
    "💰 Checking profitability...",
    "📄 Looking for AVK5 estimates...",
    "🚀 Almost there..."
  ]

  const handleUpload = async () => {
    if (!file) return
    setIsLoading(true)
    let index = 0
    const interval = setInterval(() => {
      setLoadingMsg(messages[index % messages.length])
      index++
    }, 1500)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/upload_tender`, {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      clearInterval(interval)
      setIsLoading(false)
      setResult(data)
    } catch (err) {
      clearInterval(interval)
      setIsLoading(false)
      setLoadingMsg("❌ Upload failed")
    }
  }

  return (
    <div className="p-4">
      <input type="file" accept=".pdf,.docx,.json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Upload & Analyze
      </button>

      {isLoading && <p className="mt-4">{loadingMsg}</p>}
      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">📊 Tender Analysis Result</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

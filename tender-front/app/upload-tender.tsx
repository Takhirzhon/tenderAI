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
    <div className="space-y-4 text-center">
      {/* ⬇ Beautiful styled file input */}
      <div className="flex flex-col items-center space-y-2">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded shadow transition duration-300"
        >
          📂 Choose a File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx,.json"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && (
          <p className="text-sm text-gray-700 dark:text-gray-200">📎 {file.name}</p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        📊 Upload & Analyze
      </button>

      {isLoading && <p className="mt-4 animate-pulse">{loadingMsg}</p>}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow text-left max-h-64 overflow-y-auto">
          <h3 className="text-lg font-bold">📈 Tender Analysis Result</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

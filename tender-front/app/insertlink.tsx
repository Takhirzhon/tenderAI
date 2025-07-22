"use client"

import { useState } from "react"

export default function InsertLink() {
  const [link, setLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("🔍 Parsing link...")
  const [error, setError] = useState("")

  const messages = [
    "🔍 Parsing link...",
    "📡 Contacting ProZorro API...",
    "🧠 Claude analyzing...",
    "📄 Structuring output...",
    "✅ Almost done..."
  ]

  const handleAnalyze = async () => {
    if (!link) return
    setIsLoading(true)
    setError("")
    let i = 0
    const interval = setInterval(() => {
      setLoadingMsg(messages[i % messages.length])
      i++
    }, 1500)

    try {
      const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE}/analyze_tender`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tender_hash: link.trim() })
                }
              )
        
              if (!res.ok) {
                const err = await res.json()
                throw new Error(err.detail || `Ошибка ${res.status}`)
             }
        
              const { data } = await res.json()
        
              // store it and fire the global event exactly as UploadTender does
              localStorage.setItem("tender_result", JSON.stringify(data))
              window.dispatchEvent(new Event("tender_result_updated"))

    } catch (err: any) {
      setError(err.message)
    } finally {
      clearInterval(interval)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 text-center">
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste ProZorro hash (32‑char)…"
        className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800"
      />

      <button
        onClick={handleAnalyze}
        disabled={!link || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        🔎 Download Excel
      </button>

      {isLoading && (
        <p className="animate-pulse text-sm text-gray-500 dark:text-gray-300">
          {loadingMsg}
        </p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function InsertLink() {
  const { t } = useTranslation()

  const [link, setLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(t("link.loading.0"))
  const [error, setError] = useState("")

  const messages = [
    t("link.loading.0"),
    t("link.loading.1"),
    t("link.loading.2"),
    t("link.loading.3"),
    t("link.loading.4")
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
        throw new Error(err.detail || t("link.error.generic", { code: res.status }))
      }

      const { data } = await res.json()

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
        placeholder={t("link.placeholder")}
        className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800"
      />

      <button
        onClick={handleAnalyze}
        disabled={!link || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        🔎 {t("link.button")}
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

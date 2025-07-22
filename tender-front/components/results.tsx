"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { motion } from "framer-motion"

export default function ResultsSection() {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const loadResult = () => {
      const stored = localStorage.getItem("tender_result")
      if (stored) {
        setResult(JSON.parse(stored))
      }
    }

    loadResult()
    window.addEventListener("tender_result_updated", loadResult)
    return () => window.removeEventListener("tender_result_updated", loadResult)
  }, [])

  const downloadExcel = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/download_excel`, {
      method: "POST",
      body: JSON.stringify(result),
      headers: { "Content-Type": "application/json" }
    })

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "analyzed_tender.xlsx")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!result) return null

  return (
    <motion.section
      id="results"
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mt-20 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        Tender Analysis Result
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Аналіз завершено. Натисніть кнопку нижче, щоб завантажити результат у форматі Excel.
      </p>
      <button
        onClick={downloadExcel}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
      >
        <Download className="h-5 w-5" />
        Завантажити Excel
      </button>
    </motion.section>
  )
}

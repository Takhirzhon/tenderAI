"use client"

import { useState } from "react"

const availableTemplates = [
  "Contract notice",
  "Declaration objectivity confidentiality tender preparation",
  "Tender Form supplies",
  "Retention guarantee_rev",
  "Invitation to tender_works"
]
function mergeSingleTender(raw: any[]): Record<string, any> {
  const analyses = raw.map((item) => item.analysis)
  const merged: Record<string, any> = {}
  const keys = Object.keys(analyses[0])

  for (const key of keys) {
    const vals = analyses.map((a) => a[key])
    const example = vals[0]

    if (Array.isArray(example)) {
      merged[key] = [...new Set(vals.flat())]
    } else if (typeof example === "boolean") {
      merged[key] = vals.some(Boolean)
    } else {
      const picked = vals.find(
        (v) =>
          typeof v === "string" &&
          v.trim() !== "" &&
          !v.toLowerCase().startsWith("не вказано")
      )
      merged[key] = picked ?? vals[0]
    }
  }

  merged["filename"] = raw.map((item) => item.source).join("; ")
  return merged
}

export default function TemplateGenerator() {
  const [template, setTemplate] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = async () => {
    if (!template) return
    setStatus("⏳ Generating...")

    try {
      const storedResult = localStorage.getItem("tender_result")
      if (!storedResult) {
        setStatus("❌ No analyzed tender found.")
        return
      }

      const parsed = JSON.parse(storedResult)
      const tenderResult = mergeSingleTender(parsed)  // ✅ merged correctly
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/generate_template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_name: template,
          tender_result: tenderResult
        })
      })

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${template}_filled.docx`
      link.click()

      setStatus("✅ Done!")
    } catch (err) {
      console.error("❌ Error generating template:", err)
      setStatus("❌ Error generating document")
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow rounded-xl space-y-6">
      <h2 className="text-2xl font-bold">📝 Генерація шаблону документа</h2>

      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Виберіть шаблон</option>
        {availableTemplates.map((tpl) => (
          <option key={tpl} value={tpl}>
            {tpl}
          </option>
        ))}
      </select>

      <button
        type="button"  // ✅ Prevents default submit behavior
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        📄 Створити документ
      </button>

      {status && <p className="text-center text-gray-600">{status}</p>}
    </div>
  )
}

"use client"

import { useState } from "react"

const availableTemplates = [
    "Contract notice",
    "Declaration objectivity confidentiality tender preparation",
    "Tender Form supplies",
    "Retention guarantee_rev",
    "Invitation to tender_works"
  ]
  

export default function TemplateGenerator() {
  const [template, setTemplate] = useState("")
  const [values, setValues] = useState<{ [key: string]: string }>({})
  const [status, setStatus] = useState("")

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async () => {
    if (!template) return

    setStatus("⏳ Generating...")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/generate_template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_name: template,
        values
      })
    })

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${template}_filled.docx`
    link.click()
    setStatus("✅ Done!")
  }

  const renderFields = () => {
    let placeholders: string[] = []
  
    switch (template) {
      case "Contract notice":
        placeholders = ["Назва контракту", "Місцезнаходження", "Дата", "Назва установи", "Опис контракту"]
        break
      case "Declaration objectivity confidentiality tender preparation":
        placeholders = ["Ім'я", "Дата", "Підпис"]
        break
      case "Tender Form supplies":
        placeholders = ["Tender Title", "Tender ID", "Supplier Name", "Date"]
        break
      case "Retention guarantee_rev":
        placeholders = ["Guarantee Amount", "Project Name", "Valid Until", "Bank Name"]
        break
      case "Invitation to tender_works":
        placeholders = ["Tender Name", "Deadline", "Location", "Client Name"]
        break
      default:
        placeholders = []
    }
  
    return placeholders.map((ph) => (
      <div key={ph} className="mb-4">
        <label className="block font-medium mb-1">{ph}</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => handleChange(ph, e.target.value)}
        />
      </div>
    ))
  }
  

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow rounded-xl space-y-6">
      <h2 className="text-2xl font-bold">📝 Генерація шаблону документа</h2>

      <select
        value={template}
        onChange={(e) => {
          setTemplate(e.target.value)
          setValues({})
        }}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Виберіть шаблон</option>
        {availableTemplates.map((tpl) => (
          <option key={tpl} value={tpl}>
            {tpl}
          </option>
        ))}
      </select>

      {template && renderFields()}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        📄 Створити документ
      </button>

      {status && <p className="text-center text-gray-600">{status}</p>}
    </div>
  )
}

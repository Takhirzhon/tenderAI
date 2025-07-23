"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import ResultsSection from "../components/results"

type Analysis = {
  title: string
  issuer: string
  deadline: string
  budget: string
  location: string
  project_type: string
  required_documents: string[]
  avk5_required: boolean
  technical_specs: string
  payment_terms: string
  resource_requirements: string
  timeline_feasibility: string
  profitability: string
  additional_requirements?: Record<string, string>
}

type RawResult = {
  status: string
  source: string
  analysis: Analysis
}

type MergedResult = Analysis & { filename: string }

function mergeAnalyses(raw: RawResult[]): MergedResult {
  const analyses = raw.map((r) => r.analysis)
  const merged: any = {}

  const keys = [
    "title",
    "issuer",
    "deadline",
    "budget",
    "location",
    "project_type",
    "required_documents",
    "avk5_required",
    "technical_specs",
    "payment_terms",
    "resource_requirements",
    "timeline_feasibility",
    "profitability"
  ] as const

  for (const key of keys) {
    if (key === "required_documents") {
      merged.required_documents = Array.from(
        new Set(analyses.flatMap((a) => a.required_documents))
      )
    } else if (key === "avk5_required") {
      merged.avk5_required = analyses.some((a) => a.avk5_required)
    } else {
      const vals = analyses.map((a) => (a as any)[key] as string)
      const good = vals.find(
        (v) =>
          typeof v === "string" &&
          v.trim() !== "" &&
          !/не вказано/i.test(v)
      )
      merged[key] = good ?? vals[0]
    }
  }

  const extras = analyses
    .map((a) => a.additional_requirements ?? {})
    .reduce((acc, o) => ({ ...acc, ...o }), {})

  if (Object.keys(extras).length) {
    merged.additional_requirements = extras
  }

  merged.filename = raw.map((r) => r.source).join("; ")
  return merged as MergedResult
}

export default function UploadTender() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [loadingMsg, setLoadingMsg] = useState(t("upload.status.waiting"))
  const [isLoading, setIsLoading] = useState(false)

  const messages = [
    t("upload.status.fetching"),
    t("upload.status.analyzing"),
    t("upload.status.profitability"),
    t("upload.status.avk5"),
    t("upload.status.done")
  ]

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    let idx = 0
    const interval = setInterval(() => {
      setLoadingMsg(messages[idx % messages.length])
      idx++
    }, 1500)

    const formData = new FormData()
    files.forEach((f) => formData.append("files", f))

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/upload_tenders`,
        { method: "POST", body: formData }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || t("upload.status.error", { code: res.status }))
      }

      const { files: rawResults }: { files: RawResult[] } = await res.json()

      clearInterval(interval)
      setIsLoading(false)

      const merged = rawResults.length > 1
        ? mergeAnalyses(rawResults)
        : { ...rawResults[0].analysis, filename: rawResults[0].source }

      localStorage.setItem("tender_result", JSON.stringify(merged))
      window.dispatchEvent(new Event("tender_result_updated"))

      setFiles([])
      setLoadingMsg(t("upload.status.complete"))
    } catch (e: any) {
      clearInterval(interval)
      setIsLoading(false)
      setLoadingMsg(`❌ ${e.message}`)
    }
  }

  return (
    <div className="space-y-4 text-center">
      <div className="flex flex-col items-center space-y-2">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded"
        >
          📂 {t("upload.label")}
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.docx,.json"
          className="hidden"
          onChange={(e) => {
            const all = Array.from(e.target.files || [])
            setFiles(all.slice(0, 5))
          }}
        />
        {files.length > 0 && (
          <ul className="text-sm text-gray-700 dark:text-gray-200">
            {files.map((f) => (
              <li key={f.name}>📎 {f.name}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        📊 {t("upload.button")}
      </button>

      {isLoading && (
        <p className="mt-4 animate-pulse text-gray-600 dark:text-gray-300">
          {loadingMsg}
        </p>
      )}
    </div>
  )
}

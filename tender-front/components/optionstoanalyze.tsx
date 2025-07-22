"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
import { Input } from "./ui/input"
import { useTranslation } from "react-i18next"
import DownloadTender from "../app/download_tender"
import UploadTender from "../app/upload-tender"
import InsertLink from "../app/insertlink"

export default function TestResults() {
  const { t } = useTranslation()
  const [activeTest, setActiveTest] = useState<"upload" | "link" | "downloader" | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const openModal = (test: "upload" | "link" | "downloader") => {
    setActiveTest(test)
  }

  const closeModal = () => {
    setActiveTest(null)
  }

  return (
    <section id="results" className="py-16 px-4 mb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch gap-6">
          <TestCard
            title={t("upload_title")}
            src="/upload.png"
            color="bg-green-100 dark:bg-green-900"
            onClick={() => openModal("upload")}
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center mt-auto">
              {t("upload_desc")}
            </p>
          </TestCard>

          <TestCard
            title={t("link_title")}
            src="/link.png"
            color="bg-blue-100 dark:bg-blue-900"
            onClick={() => openModal("link")}
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center mt-auto">
              {t("link_desc")}
            </p>
          </TestCard>

          <TestCard
            title={t("downloader_title")}
            src="/download.png"
            color="bg-yellow-100 dark:bg-yellow-900"
            onClick={() => openModal("downloader")}
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center mt-auto">
              {t("downloader_desc")}
            </p>
          </TestCard>
        </div>
      </div>

      <AnimatePresence>
        {activeTest && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X size={24} />
              </button>

              {activeTest === "upload" && (
                <>
                  <h3 className="text-2xl font-bold text-center mb-4">{t("upload_title")}</h3>
                  <UploadTender />
                </>
              )}

              {activeTest === "link" && (
                <>
                  <h3 className="text-2xl font-bold text-center mb-4">{t("link_title")}</h3>
                  <InsertLink />
                </>
              )}


              {activeTest === "downloader" && (
                <>
                  <h3 className="text-2xl font-bold text-center mb-4">{t("downloader_title")}</h3>
                  <DownloadTender /> {/* ✅ Use the component here */}
                </>

              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function TestCard({
  title,
  src,
  color,
  onClick,
  children,
}: {
  title: string
  src: string
  color: string
  onClick: () => void
  children?: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-lg shadow-lg p-6 cursor-pointer w-full sm:w-64 flex flex-col items-center justify-start transition-all duration-300 hover:shadow-xl ${color} min-h-[300px]`}
      onClick={onClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-full p-4 mb-4 shadow-md">
        <Image src={src || "/placeholder.svg"} alt={`${title} icon`} width={64} height={64} className="rounded-full" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">{title}</h3>
      {children}
    </motion.div>
  )
}

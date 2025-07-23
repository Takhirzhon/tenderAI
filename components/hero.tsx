"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import {
  CheckCircle,
  Sparkles,
  Star,
} from "lucide-react"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { useInView } from "react-intersection-observer"
import { useTranslation } from "react-i18next"
import translationUa from "../locales/ua/translation.json"
import translationEn from "../locales/en/translation.json"
import translationRu from "../locales/ru/translation.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ua: { translation: translationUa },
      en: { translation: translationEn },
      ru: { translation: translationRu }
    },
    fallbackLng: "ua",
    lng: "ua",
    interpolation: { escapeValue: false }
  })



export default function Hero() {
  const { t } = useTranslation()
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <section
      id="hero"
      className="relative py-4 lg:py-8 overflow-hidden rounded-2xl animate-fade-in-up"
    >
      <div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              {t("hero_title_line1")}
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {t("hero_title_line2")}
            </span>
          </motion.h1>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="relative inline-block mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-2xl blur-xl opacity-25 animate-pulse" />
            <div className="relative bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white px-8 py-5 rounded-2xl border border-emerald-300/50 transform transition-all duration-300">
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="flex-shrink-0"
                >
                  <Sparkles className="h-7 w-7 text-yellow-300 drop-shadow-sm" />
                </motion.div>
                <span className="text-xl lg:text-2xl font-bold tracking-wide">
                  {t("hero_button")}
                </span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-6 w-6 text-emerald-200" />
                  <Star className="h-5 w-5 text-yellow-300 fill-current" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

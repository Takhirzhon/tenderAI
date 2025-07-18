import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Tender Optimizer",
    "description": "Платформа на базі ШІ для аналізу, оцінки та оптимізації державних тендерів в Україні та ЄС.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "browserRequirements": "Requires JavaScript",
    "inLanguage": ["uk", "en", "ru"],
    "publisher": {
      "@type": "Organization",
      "name": "Tender AI",
      "logo": {
        "@type": "ImageObject",
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "UAH",
      "availability": "https://schema.org/InStock",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "availableLanguage": ["Ukrainian", "English", "Russian"]
    }
  }

  return (
    <Script id="structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  )
}

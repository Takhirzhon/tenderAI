'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown, Globe, Home, Menu, Moon, Sun, Trophy, X
} from 'lucide-react'

const languageOptions = [
  { label: 'Українська 🇺🇦', code: 'ua' },
  { label: 'English 🇬🇧', code: 'en' },
  { label: 'Русский 🇷🇺', code: 'ru' }
]

export default function Navbar() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState(languageOptions[0].code)
  const [activeItem, setActiveItem] = useState('hero')
  const menuRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { href: "#hero", label: t("nav.home"), icon: Home },
    { href: "#results", label: t("nav.results"), icon: Trophy }
  ]

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    setLanguage(code)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      const sections = navItems.map(item => ({
        id: item.href.slice(1),
        element: document.getElementById(item.href.slice(1))
      })).filter(section => section.element !== null)

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveItem(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 fixed top-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div
          ref={menuRef}
          className={`backdrop-blur-xl bg-white/10 dark:bg-gray-900/30 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-6 py-4 transition-all duration-300 ${isOpen ? 'h-auto' : 'h-16'} lg:h-auto`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center relative">
            <div className="flex items-center justify-between w-full lg:w-auto h-8">
              <div className="flex items-center">
                <Image src="https://cone.red/wp-content/themes/cone-red/assets/images/logo.svg" alt="Logo" width={100} height={100} className="rounded-xl text-black dark:text-white" />
              </div>
              <div className="flex items-center gap-2 lg:hidden h-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="text-black bg-gray-200 dark:text-white dark:bg-gray-800 p-1"
                >
                  {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                </Button>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm flex items-center gap-2 px-3 py-2 rounded-md ${activeItem === item.href.slice(1)
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveItem(item.href.slice(1))
                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 bg-gray-100 dark:bg-gray-800"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 bg-gray-100 dark:bg-gray-800">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languageOptions.map(lang => (
                    <DropdownMenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

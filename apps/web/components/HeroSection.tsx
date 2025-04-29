"use client"

import { useState, useEffect } from "react"
import styles from "./HeroSection.module.css"
import { useRouter } from "next/navigation"
import { IoSearch, IoLocationOutline } from "react-icons/io5"
import Image from "next/image"

const allServices = [
  "Albañil",
  "Técnico de aire acondicionado",
  "Tarquino",
  "Electricista",
  "Durlock",
  "Impermeabilización de techos",
  "Pulidor de pisos",
  "Pintor interior",
  "Pintor de alturas",
  "Electricista matriculado",
  "Vidriería y cerramientos",
  "Colocación de redes de balcones",
  "Mudanza y fletes",
  "Pequeños arreglos",
  "Plomería",
  "Soldador",
  "Destapaciones pluviales y cloacales",
]

const allLocations = [
  "Ciudad de Buenos Aires",
  "Zona Norte GBA",
  "Zona Sur GBA",
  "Zona Oeste GBA",
  "La Plata",
  "Rosario",
  "Córdoba",
  "Mendoza",
  "Mar del Plata",
]

export default function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState("")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  // Animation state
  const [activeIndex, setActiveIndex] = useState(0)

  // Status items with custom icons
  const statuses = [
    {
      icon: "/icons/image.png",
      color: "#FFC107",
    },
    {
      icon: "/icons/recommended-star.png",
      color: "#FFC107",
    },
    {
      icon: "/icons/contracted-badge.png",
      color: "#FFC107",
    },
  ]

  // Simple interval for cycling through statuses
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % statuses.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [statuses.length])

  const handleSearch = () => {
    const match = allServices.find((service) => service.toLowerCase() === searchQuery.trim().toLowerCase())

    if (!match) {
      alert("Seleccioná un servicio válido de la lista.")
      return
    }
    if (!userLocation) {
      alert("Seleccioná una zona antes de buscar.")
      return
    }

    const query = new URLSearchParams({
      servicio: match,
      location: userLocation,
    })
    router.push(`/profesionales?${query.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <section className={styles.hero}>
      {/* Replace the image with the animation */}
      <div className={styles.imageContainer}>
        <div className={styles.statusAnimation}>
          <div className={styles.statusContainer}>
            <div className={styles.statusTitle}>:</div>
            <div className={styles.statusIconsContainer}>
              {statuses.map((status, index) => (
                <div
                  key={index}
                  className={`${styles.statusItem} ${index === activeIndex ? styles.activeStatus : styles.inactiveStatus}`}
                >
                  <div className={styles.statusIconWrapper}>
                    <Image
                      src={status.icon || "/placeholder.svg"}
                      alt={status.title}
                      width={40}
                      height={40}
                      className={styles.statusIcon}
                    />
                  </div>
                  <span className={styles.statusText}>{status.title}</span>
                </div>
              ))}
            </div>
            <div className={styles.statusDots}>
              {statuses.map((_, index) => (
                <div key={index} className={`${styles.statusDot} ${index === activeIndex ? styles.activeDot : ""}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.textContainer}>
        <h1 className={styles.heroTitle}>
          <strong>¿Necesitas arreglar tu casa?</strong>
        </h1>
        <p className={styles.heroSubtitle}>...a tus problemas, <span> soluciones.</span></p>

        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <IoSearch className={styles.searchIcon} size={20} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Ej: Electricista, Plomero, Fletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              list="services"
            />
            <datalist id="services">
              {allServices.map((service, i) => (
                <option key={i} value={service} />
              ))}
            </datalist>
            <div className={styles.locationIconCircle} onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
              <IoLocationOutline size={18} />
            </div>
            {showLocationDropdown && (
              <select
                className={styles.locationDropdownOverlay}
                value={userLocation}
                onChange={(e) => {
                  setUserLocation(e.target.value)
                  setShowLocationDropdown(false)
                }}
              >
                <option value="">Seleccionar zona</option>
                {allLocations.map((loc, i) => (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button className={styles.ctaButton} onClick={handleSearch}>
            Buscar
          </button>
        </div>
      </div>
    </section>
  )
}
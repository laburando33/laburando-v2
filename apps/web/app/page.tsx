"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoSearch,
  IoCloseCircle,
  IoLocationOutline,
  IoChevronDown,
  IoHelpCircle,
  IoHammer,
  IoSnow,
  IoFlash,
  IoLayers,
  IoRainy,
  IoBrush,
  IoColorPalette,
  IoApps,
  IoWifi,
  IoCar,
  IoFlame,
  IoWater,
  IoWaterOutline,
  IoCashOutline,
  IoScaleOutline,
  IoCheckmarkCircleOutline
} from "react-icons/io5";
import Header from "../components/Header";
import styles from "./page.module.css";
import { supabase } from "@lib/supabase-web"; // ✅ AGREGADO

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState("Seleccionar ubicación");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingLocation(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setUserLocation("Av. Corrientes 1234, Buenos Aires, Argentina");
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        setUserLocation("Ubicación no disponible");
      } finally {
        setLoadingLocation(false);
      }
    };
    fetchLocation();
  }, []);

  // ✅ FUNCIÓN PARA ENVIAR A SUPABASE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !jobDescription) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const { error } = await supabase.from("requests").insert([
      {
        user_email: "anon@laburando.app",
        category: selectedService,
        job_description: jobDescription,
        location: userLocation,
      },
    ]);

    if (error) {
      alert("❌ Error al enviar la solicitud.");
    } else {
      alert("✅ ¡Solicitud enviada con éxito!");
      setSelectedService("");
      setJobDescription("");
    }
  };

  const allServices = [
    { id: 1, name: "Albañil", icon: <IoHammer size={24} color="#fff" /> },
    { id: 2, name: "Técnico de aire acondicionado", icon: <IoSnow size={24} color="#fff" /> },
    { id: 3, name: "Tarquino", icon: <IoBrush size={24} color="#fff" /> },
    { id: 4, name: "Electricista", icon: <IoFlash size={24} color="#fff" /> },
    { id: 5, name: "Durlock", icon: <IoLayers size={24} color="#fff" /> },
    { id: 6, name: "Impermeabilización de techos", icon: <IoRainy size={24} color="#fff" /> },
    { id: 7, name: "Pulidor de pisos", icon: <IoBrush size={24} color="#fff" /> },
    { id: 8, name: "Pintor interior", icon: <IoColorPalette size={24} color="#fff" /> },
    { id: 9, name: "Pintor de alturas", icon: <IoColorPalette size={24} color="#fff" /> },
    { id: 10, name: "Electricista matriculado", icon: <IoFlash size={24} color="#fff" /> },
    { id: 11, name: "Vidriería y cerramientos", icon: <IoApps size={24} color="#fff" /> },
    { id: 12, name: "Colocación de redes de balcones", icon: <IoWifi size={24} color="#fff" /> },
    { id: 13, name: "Mudanza y fletes", icon: <IoCar size={24} color="#fff" /> },
    { id: 14, name: "Pequeños arreglos", icon: <IoHammer size={24} color="#fff" /> },
    { id: 15, name: "Plomería", icon: <IoWater size={24} color="#fff" /> },
    { id: 16, name: "Soldador", icon: <IoFlame size={24} color="#fff" /> },
    { id: 17, name: "Destapaciones pluviales y cloacales", icon: <IoWaterOutline size={24} color="#fff" /> },
  ];

  const displayedServices = showAllServices ? allServices : allServices.slice(0, 7);

  const reviews = [
    {
      id: 1,
      text: "Buen profesional, recomendado. Resolvió el problema rápidamente.",
      rating: 4,
      author: "Carlos Rivas",
      date: "19-11-2024 13:19",
      professions: "Electricista, Técnico de Aire",
    },
    {
      id: 2,
      text: "Muy buen servicio, trato y predisposición para resolver los problemas.",
      rating: 5,
      author: "German Rossi",
      date: "28-10-2024 19:37",
      professions: "I.T.S.",
    },
    {
      id: 3,
      text: "El señor Yandui es muy profesional con su equipo. Excelentes.",
      rating: 4,
      author: "Vanesa Cardozo",
      date: "26-01-2025 20:06",
      professions: "Plomero, Electricista",
    },
  ];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <img src="principal2-laburandoApp.jpg" alt="Laburando" width="20%" height="20%" />
          <h1 className={styles.heroTitle}>¡Soluciones para tu hogar al TOQUE!</h1>
          <p className={styles.heroSubtitle}>
            conecta con expertos que quieren laburar  ¡Rápido y sin vueltas!
          </p>
        </section>

        {/* Buscador y Ubicación */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <IoSearch className={styles.searchIcon} size={20} color="#666" />
            <input
              type="text"
              placeholder="¿Qué servicio necesitas?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearButton} onClick={() => setSearchQuery("")}>
                <IoCloseCircle size={20} color="#666" />
              </button>
            )}
          </div>
          <button className={styles.locationContainer} onClick={() => {}}>
            <IoLocationOutline className={styles.locationIcon} size={20} color="#666" />
            {loadingLocation ? (
              <span className={styles.locationText}>Cargando...</span>
            ) : (
              <span className={styles.locationText}>{userLocation}</span>
            )}
            <IoChevronDown size={20} color="#666" />
          </button>
        </section>

        {/* Sección de Servicios */}
        <section className={styles.servicesSection}>
          <h2 className={styles.sectionTitle}>Servicios Destacados</h2>
          <div className={styles.servicesGrid}>
            {displayedServices.map((service) => (
              <Link
                key={service.id}
                href={`/request?category=${encodeURIComponent(service.name)}`}
                legacyBehavior
              >
                <a className={styles.serviceItem}>
                  <div className={styles.serviceIconContainer}>{service.icon}</div>
                  <span className={styles.serviceName}>{service.name}</span>
                </a>
              </Link>
            ))}
          </div>
          <button
            className={styles.moreServicesButton}
            onClick={() => setShowAllServices(!showAllServices)}
          >
            {showAllServices ? "Mostrar menos" : "más servicios"}
          </button>

          {/* Beneficios de usar Laburando */}
          <section className={styles.benefitsSection}>
            <h2 className={styles.sectionTitle}>¿Por qué elegir Laburando?</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <IoCashOutline size={100} color="#fcb500" />
                </div>
                <h3 className={styles.benefitTitle}>Es gratuito</h3>
                <p className={styles.benefitText}>
                  Usá Laburando sin costo: recibí presupuestos y contactá con hasta 4 profesionales.
                </p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <IoScaleOutline size={100} color="#fcb500" />
                </div>
                <h3 className={styles.benefitTitle}>Compará precios locales</h3>
                <p className={styles.benefitText}>
                  Recibí varios presupuestos desde tu PC o celular, sin compromiso.
                </p>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <IoCheckmarkCircleOutline size={100} color="#fcb500" />
                </div>
                <h3 className={styles.benefitTitle}>Contratá con confianza</h3>
                <p className={styles.benefitText}>
                  Leé opiniones y revisá perfiles antes de tomar una decisión.
                </p>
              </div>
            </div>
          </section>
        </section>

        {/* Formulario de Presupuesto + Reseñas */}
        <section className={styles.formAndReviewsContainer}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Pedir Presupuesto</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceSelect">Elige el servicio</label>
                <select
                  id="serviceSelect"
                  className={styles.inputField}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Selecciona una categoría</option>
                  {allServices.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="jobDescription">Describe el trabajo a realizar</label>
                <textarea
                  id="jobDescription"
                  placeholder="Cuéntanos en detalle qué necesitas..."
                  className={styles.inputField}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className={styles.ctaButton}>
                Enviar Solicitud
              </button>
            </form>
          </div>

          <div className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>Opiniones de Vecinos contentos</h2>
            <div className={styles.reviewsGrid}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <p className={styles.reviewText}>"{review.text}"</p>
                  <p className={styles.reviewRating}>
                    {"★".repeat(review.rating)}{" "}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                  <p className={styles.reviewAuthor}>
                    {review.author} - {review.date}
                  </p>
                  <p className={styles.reviewProfessions}>{review.professions}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

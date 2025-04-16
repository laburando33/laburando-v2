"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoSearch,
  IoCloseCircle,
  IoLocationOutline,
  IoChevronDown,
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
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import styles from "./page.module.css";
import { supabase } from "../lib/supabase-web";
import OneSignal from 'react-onesignal';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState("Seleccionar ubicación");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingLocation(true);
      await new Promise((res) => setTimeout(res, 1000));
      setUserLocation("Av. Corrientes 1234, Buenos Aires");
      setLoadingLocation(false);
    };
    fetchLocation();
  }, []);

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
      console.error(error.message);
    } else {
      alert("✅ ¡Solicitud enviada!");
      setSelectedService("");
      setJobDescription("");
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Escribe un servicio para buscar.");
      return;
    }
    const encoded = encodeURIComponent(searchQuery.trim());
    router.push(`/profesionales/${encoded}`);
  };

  const allServices = [
    { id: 1, name: "Albañil", icon: <IoHammer size={50} color="#fff" /> },
    { id: 2, name: "Técnico de aire acondicionado", icon: <IoSnow size={50} color="#fff" /> },
    { id: 3, name: "Tarquino", icon: <IoBrush size={50} color="#fff" /> },
    { id: 4, name: "Electricista", icon: <IoFlash size={50} color="#fff" /> },
    { id: 5, name: "Durlock", icon: <IoLayers size={50} color="#fff" /> },
    { id: 6, name: "Impermeabilización de techos", icon: <IoRainy size={50} color="#fff" /> },
    { id: 7, name: "Pulidor de pisos", icon: <IoBrush size={50} color="#fff" /> },
    { id: 8, name: "Pintor interior", icon: <IoColorPalette size={50} color="#fff" /> },
    { id: 9, name: "Pintor de alturas", icon: <IoColorPalette size={50} color="#fff" /> },
    { id: 10, name: "Electricista matriculado", icon: <IoFlash size={50} color="#fff" /> },
    { id: 11, name: "Vidriería y cerramientos", icon: <IoApps size={50} color="#fff" /> },
    { id: 12, name: "Colocación de redes de balcones", icon: <IoWifi size={50} color="#fff" /> },
    { id: 13, name: "Mudanza y fletes", icon: <IoCar size={50} color="#fff" /> },
    { id: 14, name: "Pequeños arreglos", icon: <IoHammer size={50} color="#fff" /> },
    { id: 15, name: "Plomería", icon: <IoWater size={50} color="#fff" /> },
    { id: 16, name: "Soldador", icon: <IoFlame size={50} color="#fff" /> },
    { id: 17, name: "Destapaciones pluviales y cloacales", icon: <IoWaterOutline size={50} color="#fff" /> },
  ];

  const displayedServices = showAllServices ? allServices : allServices.slice(0, 7);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <img src="principal2-laburandoApp.jpg" alt="Laburando" width="30%" height="30%" />
          <h1 className={styles.heroTitle}>¡Soluciones para tu hogar al TOQUE!</h1>
          <p className={styles.heroSubtitle}>
            Conectá con expertos que quieren laburar. ¡Rápido y sin vueltas!
          </p>
        </section>

        {/* Buscador */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <IoSearch className={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              placeholder="¿Qué servicio necesitás?"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={styles.clearButton}>
                <IoCloseCircle />
              </button>
            )}
          </div>
          <button className={styles.locationContainer} onClick={() => {}}>
            <IoLocationOutline className={styles.locationIcon} size={20} />
            {loadingLocation ? "Cargando..." : userLocation}
            <IoChevronDown />
          </button>
        </section>

        {/* Servicios */}
        <section className={styles.servicesSection}>
          <h2 className={styles.sectionTitle}>Servicios Destacados</h2>
          <div className={styles.servicesGrid}>
            {displayedServices.map((service) => (
              <Link key={service.id} href={`/request?category=${encodeURIComponent(service.name)}`}>
                <div className={styles.serviceItem}>
                  <div className={styles.serviceIconContainer}>{service.icon}</div>
                  <span className={styles.serviceName}>{service.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <button
            className={styles.moreServicesButton}
            onClick={() => setShowAllServices(!showAllServices)}
          >
            {showAllServices ? "Mostrar menos" : "más servicios"}
          </button>
        </section>

        {/* Beneficios */}
        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>¿Por qué elegir Laburando?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><IoCashOutline size={80} /></div>
              <h3 className={styles.benefitTitle}>Es gratuito</h3>
              <p className={styles.benefitText}>Recibí presupuestos y contactá gratis con hasta 4 profesionales.</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><IoScaleOutline size={80} /></div>
              <h3 className={styles.benefitTitle}>Compará precios</h3>
              <p className={styles.benefitText}>Recibí opciones y decidí desde tu celular o compu.</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}><IoCheckmarkCircleOutline size={80} /></div>
              <h3 className={styles.benefitTitle}>Contratá con confianza</h3>
              <p className={styles.benefitText}>Opiniones reales y perfiles verificados para que elijas seguro.</p>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Pedir Presupuesto</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <select
              className={styles.inputField}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">Selecciona un servicio</option>
              {allServices.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <textarea
              className={styles.inputField}
              placeholder="Descripción del trabajo..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button type="submit" className={styles.ctaButton}>Enviar Solicitud</button>
          </form>
        </section>
      </main>
    </div>
  );
}

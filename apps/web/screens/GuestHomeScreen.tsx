"use client";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// IMPORTA tu componente Navbar desde el paquete de UI (ajusta la ruta si es necesario)
import Navbar from "@repo/ui/components/Navbar";

const GuestHomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Función para simular o obtener la ubicación actual (en producción podrías usar expo-location)
  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      // Simulación de obtener ubicación: reemplaza esto por Location.getCurrentPositionAsync() si lo integras
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLocation("Av. Corrientes 1234, Buenos Aires, Argentina");
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      Alert.alert("Error", "No se pudo obtener tu ubicación actual.");
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Define los servicios de Laburando (modifica o extiende según tu tabla de categorías)
  const services = [
    { id: 1, name: "Albañil", icon: "hammer" },
    { id: 2, name: "Técnico de Aire", icon: "snow" },
    { id: 3, name: "Pintor", icon: "color-palette" },
    { id: 4, name: "Electricista", icon: "flash" },
    { id: 5, name: "Plomero", icon: "water" },
    // Agrega más servicios si lo requieres
  ];

  // Define los pasos del proceso (puedes adaptarlos según tu flujo)
  const steps = [
    {
      id: 1,
      title: "Registra tu solicitud",
      icon: "create-outline",
      description: "Completa el formulario con tu necesidad",
    },
    {
      id: 2,
      title: "Recibe presupuestos",
      icon: "chatbox-ellipses-outline",
      description: "Recibe hasta 4 ofertas de profesionales",
    },
    {
      id: 3,
      title: "Elige al mejor",
      icon: "star-outline",
      description: "Revisa perfiles y calificaciones",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <ScrollView style={styles.container}>
        {/* Sección de Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenido a Laburando</Text>
          <Text style={styles.welcomeSubtitle}>
            ¡Encuentra profesionales para todos tus laburos!
          </Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué servicio necesitas? Ej: Albañilería, Plomería..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Selección de Ubicación */}
        <TouchableOpacity style={styles.locationContainer} onPress={getLocation}>
          <Ionicons name="location" size={20} color="#666" style={styles.locationIcon} />
          {loadingLocation ? (
            <ActivityIndicator size="small" color="#FFC107" style={{ marginRight: 10 }} />
          ) : (
            <Text style={styles.locationText} numberOfLines={1}>
              {location || "Seleccionar ubicación"}
            </Text>
          )}
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Grid de Servicios */}
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceIconContainer}>
                <Ionicons name={service.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.moreServicesButton}>
          <Text style={styles.moreServicesText}>Más servicios</Text>
        </TouchableOpacity>

        {/* Sección de Pasos */}
        <View style={styles.stepsContainer}>
          {steps.map((step) => (
            <View key={step.id} style={styles.stepItem}>
              <View style={styles.stepIconContainer}>
                <Ionicons name={step.icon as any} size={24} color="#000" />
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          ))}
        </View>

        {/* Botón de Ayuda */}
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>¿Necesitas Ayuda?</Text>
          <Ionicons name="help-circle" size={24} color="#000" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  welcomeSection: {
    padding: 16,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  locationIcon: { marginRight: 8 },
  locationText: { flex: 1, fontSize: 16, color: "#333" },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    justifyContent: "space-between",
  },
  serviceItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fcb500",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  moreServicesButton: { alignItems: "center", padding: 16 },
  moreServicesText: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "underline",
  },
  stepsContainer: { padding: 16 },
  stepItem: { alignItems: "center", marginBottom: 24 },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  helpButtonText: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
});

export default GuestHomeScreen;

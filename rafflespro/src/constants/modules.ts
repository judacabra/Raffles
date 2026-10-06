import { Module } from "../interfaces/module.interfaces";

export const MODULES: Module[] = [
  {
    url: "/dashboard",
    icon: "⊞",
    title: "Dashboard",
    subtitle: "Módulo Dashboard",
    description: "Consulta de forma rápida el estado general y la información más importante de tu negocio.",
  },
  {
    url: "/companies",
    icon: "🏢",
    title: "Empresas",
    subtitle: "Módulo Empresas",
    description: "Administra las empresas registradas y consulta su información y configuración.",
  },
  {
    url: "/raffles",
    icon: "🎟",
    title: "Rifas",
    subtitle: "Módulo Rifas",
    description: "Crea, configura y administra tus rifas, números disponibles y resultados.",
  },
  {
    url: "/number_board",
    icon: "🔢",
    title: "Tablero",
    subtitle: "Módulo Tablero",
    description: "Visualiza y controla los números de tus rifas de forma rápida y sencilla.",
  },
  {
    url: "/users",
    icon: "👥",
    title: "Usuarios",
    subtitle: "Módulo Usuarios",
    description: "Administra las personas que tienen acceso al sistema y sus permisos.",
  },
  {
    url: "/logs",
    icon: "📋",
    title: "Bitácora",
    subtitle: "Módulo Bitácora",
    description: "Consulta el historial de acciones realizadas dentro del sistema.",
  },
];
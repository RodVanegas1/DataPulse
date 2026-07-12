# LA OLLA DE DATOS
## Plataforma de Inteligencia Territorial y Turismo de El Salvador

LA OLLA DED DATOS es una plataforma web de inteligencia territorial desarrollada para centralizar, visualizar, analizar y explorar información geográfica, turística y estadística de El Salvador mediante mapas interactivos, paneles analíticos e inteligencia artificial.

El proyecto integra información territorial, indicadores, reportes y visualizaciones geoespaciales con el objetivo de facilitar la exploración de datos y apoyar la toma de decisiones de ciudadanos, turistas e instituciones.

La arquitectura fue diseñada siguiendo principios de modularidad y escalabilidad, permitiendo incorporar nuevas funcionalidades e integraciones con servicios externos en futuras versiones sin modificar significativamente la estructura principal del sistema.

---

# Tecnologías utilizadas

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React i18next
- Leaflet
- Lucide React

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod

## Base de Datos

- PostgreSQL

## Herramientas

- Git
- GitHub
- Railway
- Prisma Studio
- ESLint
- npm

---

# Estructura del proyecto

```
DataPulse/

│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/RodVanegas1/DataPulse.git

cd DataPulse
```

---

## 2. Instalar dependencias del Backend

```bash
cd backend

npm install
```

---

## 3. Instalar dependencias del Frontend

```bash
cd ../frontend

npm install
```

---

# 🗄 Configuración de la Base de Datos

Ejecutar las migraciones de Prisma:

```bash
npx prisma migrate deploy
```

o durante desarrollo

```bash
npx prisma migrate dev
```

Posteriormente ejecutar el seed:

```bash
npx prisma db seed
```

Opcionalmente puede utilizar Prisma Studio:

```bash
npx prisma studio
```

---

# Ejecución del proyecto

## Backend

```bash
cd backend

npm run dev
```

Servidor disponible en:

```
http://localhost:4000
```

---

## Frontend

```bash
cd frontend

npm run dev
```

Aplicación disponible en:

```
http://localhost:5173
```

---

# Variables de entorno

## Backend (.env)

```env
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database

PORT=4000

NODE_ENV=development
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:4000/api/v1
```

---

# Estado actual del proyecto

## Funcionalidades completamente implementadas

Actualmente la plataforma cuenta con las siguientes funcionalidades completamente desarrolladas e integradas:

- Arquitectura Full Stack basada en React, Express y TypeScript.
- API REST desarrollada con Express.
- Base de datos PostgreSQL administrada mediante Prisma ORM.
- Arquitectura modular y escalable.
- Mapa interactivo para la visualización geográfica.
- Navegación completa entre módulos.
- Dashboard principal.
- Gestión de departamentos.
- Gestión de municipios.
- Gestión de categorías.
- Gestión de lugares turísticos.
- Internacionalización (i18n).
- Seed inicial de datos para demostración.
- Sistema de reportes base.
- Sistema de datasets.
- Gestión de indicadores.
- Gestión de estadísticas.
- Gestión de eventos.
- Integración entre frontend y backend.

---

# Funcionalidades implementadas parcialmente (Mockup / Prototipo)

La plataforma fue diseñada con una arquitectura preparada para crecer en futuras versiones. Algunas funcionalidades ya cuentan con su interfaz gráfica y estructura de integración, pero actualmente funcionan como prototipos (mockups) debido a que requieren una etapa adicional de desarrollo o integración con servicios externos.

## Asistente Inteligente (IA)

LA OLLA DE DATOS incorpora una interfaz para un asistente basado en Inteligencia Artificial.

Actualmente:

- La interfaz está completamente desarrollada.
- El flujo de conversación está implementado.
- La arquitectura del backend está preparada para consumir un modelo de IA.

Sin embargo, el asistente **aún no responde consultas reales sobre la plataforma**, ya que requiere una etapa de entrenamiento y contextualización utilizando la información territorial y turística almacenada en DataPulse.

Esto permitirá que, en futuras versiones, el asistente pueda responder preguntas como:

- Recomendar destinos turísticos.
- Explicar indicadores.
- Comparar departamentos y municipios.
- Analizar estadísticas.
- Generar recomendaciones personalizadas.
- Consultar información mediante lenguaje natural.

Esta funcionalidad representa una oportunidad de escalabilidad futura del proyecto.

---

## Sistema avanzado de búsqueda y filtros

La plataforma incorpora el diseño completo del sistema de búsqueda y filtros.

Actualmente la interfaz gráfica se encuentra implementada; sin embargo, parte de la lógica avanzada de filtrado aún está en proceso de integración con el backend.

Entre las funcionalidades contempladas se encuentran:

- Búsqueda por nombre de lugar.
- Filtrado por departamento.
- Filtrado por municipio.
- Filtrado por categoría.
- Filtrado por etiquetas.
- Filtrado por servicios.
- Filtrado por estacionamiento.
- Filtrado por WiFi.
- Filtrado por accesibilidad.
- Filtrado por lugares Pet Friendly.
- Filtrado por idioma.
- Filtrado por calificación.
- Filtrado por fechas.

La arquitectura del sistema fue diseñada para incorporar estas capacidades sin modificar la estructura principal del proyecto.

---

## Configuración visual

La plataforma incluye una sección de configuración visual enfocada en mejorar la experiencia del usuario.

Actualmente esta sección corresponde a un mockup funcional que permite visualizar futuras opciones como:

- Cambio de apariencia.
- Configuración de temas.
- Preferencias de idioma.
- Configuración del mapa.
- Ajustes de accesibilidad.
- Preferencias generales del usuario.

Estas opciones aún no modifican el comportamiento interno de la aplicación, ya que su implementación forma parte de futuras etapas del desarrollo.

La estructura del sistema fue diseñada para incorporar estas funcionalidades sin realizar cambios importantes en la arquitectura existente.

---

## Indicadores y analítica

Los indicadores, dashboards y métricas funcionan actualmente con datos de demostración generados para validar el funcionamiento de la plataforma.

En futuras versiones podrán alimentarse automáticamente mediante APIs oficiales y servicios institucionales.

---

## Reportes

La infraestructura para la generación de reportes ya se encuentra desarrollada.

Actualmente utiliza datos de demostración y será ampliada para generar reportes dinámicos utilizando la información almacenada en la plataforma.

---

# Funcionalidades pendientes

Como parte de la evolución del proyecto se contempla incorporar:

- Entrenamiento completo del asistente de IA.
- Integración con APIs oficiales del Gobierno de El Salvador.
- Actualización automática de datos territoriales.
- Panel administrativo.
- Gestión de usuarios.
- Autenticación y autorización.
- Notificaciones.
- Favoritos.
- Historial de consultas.
- Analítica en tiempo real.
- Nuevas capas GIS.
- Reportes inteligentes mediante IA.
- Recomendaciones personalizadas.
- Integración con OpenStreetMap y otras plataformas geoespaciales.

---

# Información administrada por la plataforma

Actualmente DataPulse administra información relacionada con:

- Departamentos
- Municipios
- Categorías
- Lugares turísticos
- Eventos
- Indicadores
- Estadísticas
- Datasets
- Reportes
- Exportaciones
- Idiomas
- Capas geográficas
- Etiquetas

---

# Autor

**Rodrigo Alberto Vanegas Santamaría -** - 
**Paúl Ronaldo Velá Coto -** - 
**Josué Alejandro García Quevedo**

Proyecto desarrollado con fines académicos como una propuesta tecnológica para la exploración, análisis y visualización de información territorial y turística de El Salvador.

---

# Licencia

Este proyecto fue desarrollado con fines académicos y de innovación tecnológica.

Todos los derechos reservados © 2026.

# ARCHITECTURE_AGENT.md

## Objetivo

Definir y optimizar la estructura de la landing page para maximizar conversión.

## Estructura Base Obligatoria

### 1. Hero Section

* Logo Mandarina Store Tuc 🍊
* Tagline: "PEGA TU ESTILO EN TODAS PARTES"
* CTA principal: "Ver Stickers"
* Fondo visual urbano (ruido + contraste)

---

### 2. Categorías

* Grid con iconos y colores
* Scroll horizontal en mobile
* Categorías:

  * Stickers
  * Vinilos
  * Prints
  * Pins

---

### 3. Productos Destacados

* Grid responsive
* Cards con:

  * Imagen
  * Precio
  * Badge (nuevo / popular)
* Hover → detalle rápido

---

### 4. Modal de Producto

* Material
* Acabado
* Tamaño
* Impermeable
* CTA: "Consultar por WhatsApp"

---

### 5. Prueba Social

* Rating: 4.9/5
* +10.000 clientes
* Testimonios reales

---

### 6. Beneficios

* Durabilidad
* Impermeabilidad
* Diseño único

---

### 7. CTA Final

* Botón grande
* Copy emocional:
  "Llevá tu estilo a todos lados"

---

### 8. Footer

* Redes sociales
* Categorías
* Info legal

---

## Reglas de Arquitectura

* Mobile-first SIEMPRE
* Máximo 3 clicks hasta CTA
* Evitar scroll infinito sin dirección
* Cada sección debe tener un objetivo claro

## Anti-Patrones

* Demasiado texto
* CTAs genéricos ("Enviar")
* Navegación confusa
* Carga pesada de imágenes

## Integración con Admin

* Productos dinámicos desde Supabase
* Categorías con slug automático
* Imágenes optimizadas desde Storage

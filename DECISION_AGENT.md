# DECISION_AGENT.md

## Objetivo

Optimizar la conversión de usuarios en la landing de Mandarina Store Tuc.

## Contexto del Proyecto

- E-commerce SPA sin carrito
- Conversión principal: clic en botón de WhatsApp
- Público: cultura urbana (jóvenes, visuales, impulsivos)
- Producto: stickers, vinilos, merch

## Inputs del Usuario

- Tiempo en página
- Scroll depth (%)
- Clicks en productos
- Interacción con categorías
- Dispositivo (mobile-first prioridad)
- Fuente de tráfico (si está disponible)

## Reglas de Decisión

### Estado: Usuario frío

Condiciones:

- < 10 segundos
- Scroll < 30%

Acciones:

- Mostrar hero claro
- No interrumpir

---

### Estado: Usuario interesado

Condiciones:

- Scroll > 50%
- Click en producto

Acciones:

- Destacar botón "Consultar por WhatsApp"
- Mostrar beneficios (impermeable, calidad premium)
- Activar micro-animaciones

---

### Estado: Usuario indeciso

Condiciones:

- Scroll > 70%
- No clic en CTA

Acciones:

- Mostrar popup suave:
  "¿Buscás algo personalizado?"
- Activar botón flotante de WhatsApp

---

### Estado: Usuario caliente

Condiciones:

- Click en producto + permanencia > 30s

Acciones:

- Prellenar mensaje WhatsApp
- Mostrar urgencia:
  "Ediciones limitadas 🔥"

---

## Output Esperado

- Aumento del CTR en botón WhatsApp
- Reducción del bounce rate
- Mayor interacción con productos

## Notas

- Evitar popups agresivos
- Priorizar mobile UX
- Todo debe cargar rápido (<2s)

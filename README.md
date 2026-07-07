# 🎯 PUNTOS CLAVE PARA TU EXPOSICIÓN

## 1. ¿Qué es este proyecto?

- Suite de pruebas E2E (End-to-End) para el sitio web de Bruno Ferrini (tienda de calzado)
- Usa Playwright + TypeScript como framework de automatización
- Valida funcionalidades críticas de un e-commerce real

## 2. Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| Playwright | Framework de automatización de navegadores |
| TypeScript | Lenguaje tipado para mayor robustez |
| Chromium | Navegador objetivo de las pruebas |
| VTEX | Plataforma del e-commerce (se identifica por sus selectores CSS) |

## 3. Estructura del Proyecto
````text
├── tests/
│   ├── navigation.spec.ts
│   ├── login.spec.ts
│   ├── register.spec.ts
│   ├── search.spec.ts
│   ├── products.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── profile.spec.ts
├── helpers/
│   ├── actions.ts
│   └── data.ts
├── playwright.config.ts
└── package.json
````

## 4. Funcionalidades Probadas (8 Módulos)

| # | Módulo | Qué valida |
|---|--------|------------|
| 1 | Navegación | Logo, menú principal, URL correcta, link de WhatsApp |
| 2 | Login | Error con email no registrado, permanece en login |
| 3 | Registro | Formulario acepta email válido, solicita siguiente paso |
| 4 | Búsqueda | Muestra resultados para productos existentes, maneja "sin resultados" |
| 5 | Productos | Nombre, precio, imagen y botón "Añadir a la bolsa" |
| 6 | Carrito | Contador se actualiza, producto visible en minicart |
| 7 | Pagos | Redirige a login si no hay sesión, validación de DNI (8 dígitos) |
| 8 | Perfil | Redirige a login sin autenticación |

## 5. Características Técnicas Destacables

### ✅ Helpers reutilizables:
- `acceptCookies()` → Maneja banner de CookieBot automáticamente
- `generateTestEmail()` → Crea emails únicos con timestamp
- `searchProduct()` → Abre buscador y ejecuta búsqueda
- `TEST_DATA` → Datos de prueba centralizados (DNI válido/inválido, emails)

### ✅ Configuración inteligente (playwright.config.ts):
- `baseURL`: https://www.brunoferrini.com.pe
- `timeout`: 60000ms por test
- `retries`: 1 (local) / 2 (CI)
- `screenshot`: only-on-failure → Solo captura si falla
- `trace`: on-first-retry → Traza para debugging

### ✅ Selectores basados en DOM real:
- Usa clases específicas de VTEX (`.vtex-store-components-3-x-*`)
- No usa selectores frágiles (XPath absoluto)
- Incluye waits explícitos (`waitForTimeout`, `isVisible`)

## 6. Limitaciones Documentadas

⚠️ **Tests que requieren autenticación real:**
- Registro completo (necesita código OTP del email)
- Agregar tarjetas de crédito
- Modificar perfil/dirección

**Solución implementada:** Verifican que redirige al login correctamente (flujo equivalente)

## 7. Métricas del Proyecto

- 📄 9 archivos de prueba
- 💻 ~700 líneas de código total
- 🎯 8 áreas funcionales cubiertas
- ⚙️ 1 worker (ejecución secuencial, no paralela)

## 8. Frases Clave para tu Exposición

> "Este proyecto automatiza la validación de un e-commerce real usando Playwright, cubriendo desde navegación hasta checkout"

> "Los helpers centralizan lógica repetitiva como aceptar cookies o generar datos de prueba únicos"

> "La configuración incluye retries automáticos y capturas solo en fallos para optimizar recursos"

> "Se documentan limitaciones cuando se requiere autenticación real sin credenciales de prueba"

## 9. Posibles Preguntas y Respuestas

| Pregunta | Respuesta |
|----------|-----------|
| ¿Por qué Playwright? | Soporta múltiples navegadores, tiene auto-waits y trazas de debugging |
| ¿Las pruebas son independientes? | Sí, cada test navega desde cero y no depende del estado anterior |
| ¿Qué pasa si el sitio cambia? | Los selectores CSS de VTEX son estables, pero requerirían actualización si cambian |
| ¿Se puede ejecutar en CI/CD? | Sí, la configuración ya incluye retries: 2 para entornos CI |

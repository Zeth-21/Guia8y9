import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para las pruebas E2E de Bruno Ferrini
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directorio donde se encuentran los archivos de prueba
  testDir: './tests',

  // Ejecutar tests en archivos en paralelo
  fullyParallel: false,

  // Fallar el build en CI si se dejaron test.only accidentalmente
  forbidOnly: !!process.env.CI,

  // Reintentar tests fallidos en CI
  retries: process.env.CI ? 2 : 1,

  // Número de workers
  workers: 1,

  // Reporter HTML para visualizar resultados
  reporter: 'html',

  // Configuración compartida para todos los tests
  use: {
    // URL base del sitio
    baseURL: 'https://www.brunoferrini.com.pe',

    // Recopilar traza en el primer reintento
    trace: 'on-first-retry',

    // Captura de pantalla en caso de fallo
    screenshot: 'only-on-failure',

    // Timeout para acciones individuales (click, fill, etc.)
    actionTimeout: 15000,

    // Timeout para navegación
    navigationTimeout: 30000,

    // Ignorar errores HTTPS
    ignoreHTTPSErrors: true,
  },

  // Timeout global por test (60 segundos)
  timeout: 60000,

  // Proyectos: solo Chromium para este caso
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

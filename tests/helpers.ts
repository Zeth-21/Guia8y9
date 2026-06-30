import { Page, expect } from '@playwright/test';

/**
 * Helper reutilizable para acciones comunes en el sitio Bruno Ferrini.
 * Centraliza la lógica de aceptación de cookies, login y navegación.
 */

/** URL base del sitio */
export const BASE_URL = 'https://www.brunoferrini.com.pe';

/**
 * Acepta el banner de cookies de CookieBot si está visible.
 * Evita que el popup bloquee interacciones en la página.
 */
export async function acceptCookies(page: Page): Promise<void> {
  try {
    const cookieBtn = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    if (await cookieBtn.isVisible({ timeout: 5000 })) {
      await cookieBtn.click();
      // Esperar a que el dialog de cookies desaparezca
      await page.locator('#CybotCookiebotDialog').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  } catch {
    // Si no aparece el banner de cookies, continuar normalmente
  }
}

/**
 * Navega a la página de login de Bruno Ferrini.
 * El sitio redirige /account a /login?returnUrl=%2Faccount cuando no hay sesión.
 */
export async function navigateToLogin(page: Page): Promise<void> {
  await page.goto('/account', { waitUntil: 'networkidle' });
  await acceptCookies(page);
}

/**
 * Intenta hacer login con las credenciales proporcionadas.
 * El flujo de login en VTEX usa un input de email seguido de un input de contraseña.
 * 
 * @param page - Instancia de Page de Playwright
 * @param email - Correo electrónico del usuario
 * @param password - Contraseña del usuario
 */
export async function attemptLogin(page: Page, email: string, password: string): Promise<void> {
  // Ingresar email en el campo de login
  const emailInput = page.getByPlaceholder('Ej.: ejemplo@mail.com');
  await emailInput.fill(email);

  // Ingresar contraseña
  const passwordInput = page.getByPlaceholder('Ingrese su contraseña');
  await passwordInput.fill(password);

  // Hacer click en el botón de iniciar sesión/entrar
  // En VTEX, el botón de login suele tener la clase vtex-login-2-x y texto "Entrar" o "Iniciar sesión"
  const loginButton = page.locator('.vtex-login-2-x-sendButton, button.vtex-button').filter({ hasText: /entrar|iniciar/i }).first();
  await loginButton.click();
}

/**
 * Espera a que la página principal cargue completamente.
 * Verifica que el logo y menú principal sean visibles.
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  // Esperar al logo
  await page.locator('.vtex-store-components-3-x-logoContainer').first().waitFor({ state: 'visible', timeout: 15000 });
}

/**
 * Abre el buscador y realiza una búsqueda.
 * En el sitio VTEX de Bruno Ferrini, hay un input de búsqueda en el header.
 * 
 * @param page - Instancia de Page de Playwright
 * @param searchTerm - Término de búsqueda
 */
export async function searchProduct(page: Page, searchTerm: string): Promise<void> {
  // El buscador puede estar oculto detrás de un ícono/trigger modal
  // Intentar click en el trigger del buscador primero
  const searchTrigger = page.locator('.vtex-modal-layout-0-x-triggerContainer--searchDespalgable-triger').first();
  const isTriggerVisible = await searchTrigger.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (isTriggerVisible) {
    await searchTrigger.click();
    await page.waitForTimeout(500); // Esperar animación del modal
  }

  // Buscar el input de búsqueda
  const searchInput = page.getByPlaceholder(/buscar|search/i).first();
  await searchInput.fill(searchTerm);
  await searchInput.press('Enter');
}

/**
 * Genera un email único para pruebas de registro.
 * Usa timestamp para asegurar unicidad.
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  return `test.brunoferrini.${timestamp}@mailinator.com`;
}

/**
 * Genera datos ficticios para pruebas de DNI.
 * DNI peruano tiene 8 dígitos.
 */
export const TEST_DATA = {
  /** DNI válido ficticio (8 dígitos) */
  validDNI: '12345678',
  /** DNI inválido (9 dígitos) - para prueba de validación */
  invalidDNI: '123456789',
  /** Email de prueba no registrado */
  unregisteredEmail: 'usuario.no.existe.qa.test@gmail.com',
  /** Contraseña de prueba */
  testPassword: 'TestPassword123!',
  /** Término de búsqueda con resultados esperados */
  existingProduct: 'zapato',
  /** Término de búsqueda sin resultados esperados */
  nonExistentProduct: 'xyzproductoinexistente123abc',
};

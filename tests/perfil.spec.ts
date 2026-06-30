import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers';

/**
 * Pruebas E2E para la sección de Perfil en Bruno Ferrini.
 * 
 * NOTA IMPORTANTE: Las funcionalidades de perfil (modificar datos, agregar dirección)
 * requieren autenticación previa. Dado que:
 * 
 * 1. No se proporcionaron credenciales válidas de prueba
 * 2. El registro requiere código OTP real
 * 3. No hay cuenta de prueba disponible
 * 
 * Estos tests verifican que la página de perfil redirige correctamente
 * al login cuando no hay sesión activa, y documentan el flujo esperado.
 * 
 * Se implementa el flujo equivalente más cercano posible sin autenticación.
 */

test.describe('Perfil de usuario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/account', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
  });

  test('5. Acceso a perfil sin autenticación redirige a login', async ({ page }) => {
    /**
     * Caso equivalente: Verificar que al intentar acceder al perfil sin sesión,
     * el sistema redirige correctamente a la página de login.
     * 
     * MOTIVO: No se puede modificar datos del perfil sin autenticación previa.
     * No se dispone de credenciales de prueba válidas.
     * 
     * Validaciones:
     *   - La URL contiene "login"
     *   - Se muestra el formulario de login
     *   - El campo de email está presente para iniciar sesión
     */

    // Esperar redirección al login
    await page.waitForTimeout(2000);

    // Validar que redirigió a la página de login
    await expect(page).toHaveURL(/login/);

    // Validar que el formulario de login está presente
    const emailInput = page.getByPlaceholder('Ej.: ejemplo@mail.com');
    await expect(emailInput).toBeVisible();

    // Validar que el campo de contraseña está presente
    const passwordInput = page.getByPlaceholder('Ingrese su contraseña');
    await expect(passwordInput).toBeVisible();

    // Validar que hay un botón para iniciar sesión
    const loginBtn = page.locator('button.vtex-button').first();
    await expect(loginBtn).toBeVisible();

    console.log('NOTA: Modificación de perfil requiere autenticación.');
    console.log('Se verificó que el acceso sin sesión redirige correctamente al login.');
  });

  test('6. Acceso a direcciones sin autenticación redirige a login', async ({ page }) => {
    /**
     * Caso equivalente: Verificar que al intentar acceder a las direcciones
     * del usuario sin sesión activa, el sistema redirige al login.
     * 
     * MOTIVO: No se puede agregar una dirección nueva sin autenticación.
     * No se dispone de credenciales de prueba válidas.
     * 
     * Validaciones:
     *   - Intentar acceder a /account#/addresses redirige a login
     *   - El formulario de login está presente
     */

    // Intentar navegar directamente a la sección de direcciones
    await page.goto('/account#/addresses', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Validar que redirigió a la página de login
    await expect(page).toHaveURL(/login/);

    // Validar que el formulario de login está visible
    const emailInput = page.getByPlaceholder('Ej.: ejemplo@mail.com');
    await expect(emailInput).toBeVisible();

    console.log('NOTA: Agregar dirección requiere autenticación.');
    console.log('Se verificó que el acceso a /account#/addresses redirige al login.');
  });
});

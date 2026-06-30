import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers';

/**
 * Pruebas E2E para la navegación principal del sitio Bruno Ferrini.
 * 
 * Valida que la página principal carga correctamente con todos sus
 * elementos principales y que la navegación a categorías funciona.
 * 
 * Selectores basados en la inspección real del DOM:
 * - Logo: img con alt="Logo", clase vtex-store-components-3-x-logoImage--logoTienda
 * - Menú: elementos con clase vtex-menu-2-x-styledLink--item-principal
 * - Categorías: /bruno-ferrini, /florsheim, /nunn-bush, etc.
 * - WhatsApp: a[href*="api.whatsapp.com"]
 */

test.describe('Navegación del sitio', () => {
  test('10. Página principal muestra logo, menú y URL correcta', async ({ page }) => {
    /**
     * Caso: Abrir la página principal del sitio.
     * Validaciones:
     *   - Logo visible
     *   - Menú principal visible
     *   - URL correcta (https://www.brunoferrini.com.pe/)
     */

    // Navegar a la página principal
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);

    // Validar: URL correcta
    await expect(page).toHaveURL(/brunoferrini\.com\.pe\/?$/);

    // Validar: Logo visible
    // El logo tiene alt="Logo" y clase vtex-store-components-3-x-logoImage--logoTienda
    const logo = page.locator('img.vtex-store-components-3-x-logoImage--logoTienda').first();
    await expect(logo).toBeVisible({ timeout: 15000 });

    // Verificar que el logo tiene el alt text correcto
    await expect(logo).toHaveAttribute('alt', 'Logo');

    // Validar: Menú principal visible
    // Los items del menú principal tienen la clase vtex-menu-2-x-styledLink--item-principal
    const menuItems = page.locator('.vtex-menu-2-x-styledLink--item-principal');
    
    // Debe haber al menos los items principales: Mujer, Hombre, Accesorios, Marcas
    await expect(menuItems.first()).toBeVisible({ timeout: 10000 });
    const menuCount = await menuItems.count();
    expect(menuCount).toBeGreaterThanOrEqual(3);

    // Verificar que los textos del menú son los esperados
    const menuTexts = await menuItems.allTextContents();
    const expectedMenuItems = ['Mujer', 'Hombre', 'Accesorios', 'Marcas'];
    
    for (const expected of expectedMenuItems) {
      const found = menuTexts.some(text => text.includes(expected));
      expect(found).toBeTruthy();
    }
  });

  test('11. Navegar a categoría de productos muestra productos', async ({ page }) => {
    /**
     * Caso: Navegar a una categoría de productos (marca Bruno Ferrini).
     * Validaciones:
     *   - La URL cambia a la categoría seleccionada
     *   - Se muestran productos visibles en la página
     * 
     * Se usa la categoría /bruno-ferrini que fue verificada en la inspección
     * del DOM y contiene productos reales.
     */

    // Navegar directamente a la categoría Bruno Ferrini
    await page.goto('/bruno-ferrini', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);

    // Validar: Cambio de URL
    await expect(page).toHaveURL(/\/bruno-ferrini/);

    // Esperar a que los productos carguen (VTEX carga productos asincrónicamente)
    const productContainer = page.locator('.vtex-product-summary-2-x-container').first();
    await expect(productContainer).toBeVisible({ timeout: 20000 });

    // Validar: Productos visibles
    const productCount = await page.locator('.vtex-product-summary-2-x-container').count();
    expect(productCount).toBeGreaterThan(0);

    // Verificar que los productos tienen elementos esenciales:
    // - Imagen del producto
    const productImage = page.locator('.vtex-product-summary-2-x-imageNormal').first();
    await expect(productImage).toBeVisible();

    // - Nombre/marca del producto
    const productBrand = page.locator('.vtex-product-summary-2-x-productBrandName').first();
    await expect(productBrand).toBeVisible();

    // - Precio del producto
    const productPrice = page.locator('.vtex-product-price-1-x-sellingPriceValue').first();
    await expect(productPrice).toBeVisible();
  });

  test('8. Botón de WhatsApp redirige correctamente', async ({ page }) => {
    /**
     * Caso: Verificar que el enlace de WhatsApp existe y apunta correctamente.
     * Validaciones:
     *   - El enlace de WhatsApp existe en la página
     *   - El href apunta a wa.me o api.whatsapp.com
     * 
     * Basado en inspección del DOM:
     * - Link 1: api.whatsapp.com/send?phone=51987967280 (texto: "987 967 280")
     * - Link 2: api.whatsapp.com/send/?phone=+51987968056 (ícono footer sticky)
     */

    // Navegar a la página principal
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);

    // Esperar a que cargue el contenido del footer
    await page.waitForTimeout(3000);

    // Validar: El enlace de WhatsApp existe
    const whatsappLinks = page.locator('a[href*="api.whatsapp.com"], a[href*="wa.me"]');
    const whatsappCount = await whatsappLinks.count();
    expect(whatsappCount).toBeGreaterThan(0);

    // Validar: El enlace apunta a api.whatsapp.com o wa.me
    const firstWhatsappLink = whatsappLinks.first();
    const href = await firstWhatsappLink.getAttribute('href');
    expect(href).toBeTruthy();
    
    // Verificar que el href contiene la URL correcta de WhatsApp
    const isValidWhatsappUrl = href!.includes('api.whatsapp.com') || href!.includes('wa.me');
    expect(isValidWhatsappUrl).toBeTruthy();

    // Verificar que incluye un número de teléfono
    const hasPhoneNumber = href!.includes('phone=');
    expect(hasPhoneNumber).toBeTruthy();

    // Verificar el número de teléfono esperado (basado en inspección del DOM)
    const hasExpectedPhone = href!.includes('51987967280') || href!.includes('51987968056');
    expect(hasExpectedPhone).toBeTruthy();
  });
});

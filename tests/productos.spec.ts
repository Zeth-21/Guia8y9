import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers';

/**
 * Pruebas E2E para el detalle de productos en Bruno Ferrini.
 * 
 * El sitio VTEX muestra el detalle de producto (PDP) con:
 * - Nombre/marca: .vtex-store-components-3-x-productBrandName
 * - Precio: .vtex-product-price-1-x-sellingPriceValue
 * - Imagen principal: .vtex-store-components-3-x-productImageTag--main
 * - Botón comprar: botón con texto "AÑADIR A LA BOLSA"
 * 
 * URL de producto verificada en inspección:
 * /bruno-ferrini-mujer-botas---botines-dc12606p01-226/p
 */

test.describe('Detalle de producto', () => {
  test('14. Detalle de producto muestra nombre, precio, imagen y botón de agregar al carrito', async ({ page }) => {
    /**
     * Caso: Abrir el detalle de un producto.
     * Validaciones:
     *   - Nombre del producto visible
     *   - Precio visible
     *   - Imagen del producto visible
     *   - Botón "Agregar al carrito" (AÑADIR A LA BOLSA) visible
     * 
     * Se navega primero a la categoría para obtener un link de producto real,
     * y luego se accede al detalle.
     */

    // Navegar a la categoría Bruno Ferrini para encontrar productos
    await page.goto('/bruno-ferrini', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);

    // Esperar a que carguen los productos
    const firstProductLink = page.locator('.vtex-product-summary-2-x-clearLink').first();
    await expect(firstProductLink).toBeVisible({ timeout: 20000 });

    // Obtener el href del primer producto
    const productHref = await firstProductLink.getAttribute('href');
    expect(productHref).toBeTruthy();

    // Navegar al detalle del producto
    await page.goto(productHref!, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Validar: Nombre del producto visible
    // La marca/nombre aparece con la clase vtex-store-components-3-x-productBrandName
    const productName = page.locator('.vtex-store-components-3-x-productBrandName').first();
    await expect(productName).toBeVisible({ timeout: 15000 });
    const nameText = await productName.textContent();
    expect(nameText).toBeTruthy();
    expect(nameText!.length).toBeGreaterThan(0);

    // Validar: Precio visible
    // El precio de venta usa la clase vtex-product-price-1-x-sellingPriceValue
    const productPrice = page.locator('.vtex-product-price-1-x-sellingPriceValue').first();
    await expect(productPrice).toBeVisible({ timeout: 10000 });
    const priceText = await productPrice.textContent();
    expect(priceText).toBeTruthy();
    // El precio debe contener "S/" (soles peruanos)
    expect(priceText).toContain('S/');

    // Validar: Imagen del producto visible
    // La imagen principal usa la clase vtex-store-components-3-x-productImageTag--main
    const productImage = page.locator('.vtex-store-components-3-x-productImageTag--main').first();
    
    // Si la imagen principal con clase --main no está visible, buscar cualquier imagen del producto
    const isMainImageVisible = await productImage.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isMainImageVisible) {
      await expect(productImage).toBeVisible();
    } else {
      // Alternativa: Buscar cualquier imagen en el contenedor de producto
      const anyProductImage = page.locator('.vtex-store-components-3-x-productImageTag').first();
      await expect(anyProductImage).toBeVisible({ timeout: 10000 });
    }

    // Validar: Botón "Agregar al carrito" visible
    // En el DOM real, el texto del botón es "AÑADIR A LA BOLSA"
    const addToCartBtn = page.getByRole('button', { name: /AÑADIR A LA BOLSA/i });
    const isAddBtnVisible = await addToCartBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (isAddBtnVisible) {
      await expect(addToCartBtn).toBeVisible();
    } else {
      // Alternativa: Buscar botón con texto similar
      const altBtn = page.locator('button').filter({ hasText: /añadir|agregar|comprar|bolsa|carrito/i }).first();
      await expect(altBtn).toBeVisible({ timeout: 10000 });
    }
  });
});

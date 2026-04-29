import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = './docs/screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const MODULES = [
  { id: 'dashboard', label: 'Panel Principal' },
  { id: 'pos',       label: 'Punto de Venta' },
  { id: 'kds',       label: 'Cocina (KDS)' },
  { id: 'validation', label: 'Validar Ticket' },
  { id: 'guests',    label: 'Huéspedes' },
  { id: 'cabins',    label: 'Cabañas' },
  { id: 'users',     label: 'Personal' },
  { id: 'inventory', label: 'Inventario' },
  { id: "sales",     label: "Historial" },
  { id: "qr",        label: "Códigos QR" },
  { id: "config",    label: "Configuración" },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  for (const module of MODULES) {
    console.log(`Capturing: ${module.label}...`);
    
    // Find button by text in the sidebar
    const button = page.locator(`button:has-text("${module.label}")`);
    if (await button.count() > 0) {
      await button.click();
      await page.waitForTimeout(1000); // Wait for animation
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `${module.id}.png`),
        fullPage: false
      });
      console.log(`  Saved: ${module.id}.png`);
    } else {
      console.warn(`  Button not found for: ${module.label}`);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

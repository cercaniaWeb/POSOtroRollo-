import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const HTML_FILE = 'docs/GUIA_USUARIO.html';
const PDF_FILE = 'docs/GUIA_USUARIO.pdf';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const absolutePath = path.resolve(HTML_FILE);
  const fileUrl = `file://${absolutePath}`;
  
  console.log(`Opening ${fileUrl}...`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  
  console.log('Generating PDF...');
  await page.pdf({
    path: PDF_FILE,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });
  
  await browser.close();
  console.log(`PDF successfully generated at ${PDF_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

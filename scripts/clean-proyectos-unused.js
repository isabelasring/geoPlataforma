/**
 * Borra de proyectos/ todo lo que NO está en los data/*-images.js
 * Mantiene: 360_PEPSICO_60.jpg y en cada carpeta solo las imágenes listadas en el data correspondiente.
 * Borra: .ARW, .MOV, .DS_Store y cualquier imagen no listada.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROYECTOS = path.join(ROOT, 'proyectos');
const DATA_DIR = path.join(ROOT, 'html', 'data');

function parseImagesFromDataFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/=\s*\[([\s\S]*?)\]\s*;?\s*$/m);
  if (!match) return new Set();
  const arrStr = '[' + match[1] + ']';
  let arr;
  try {
    arr = JSON.parse(arrStr.replace(/"([^"]+)"/g, '"$1"'));
  } catch (e) {
    const quoted = arrStr.replace(/'([^']*)'/g, '"$1"').replace(/"([^"]*)"/g, '"$1"');
    try {
      arr = JSON.parse(quoted);
    } catch (e2) {
      return new Set();
    }
  }
  const names = arr.map((s) => String(s).trim());
  return new Set(names);
}

function parseImagesFromDataFileSimple(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const names = [];
  const re = /"([^"]+)"|'([^']+)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = (m[1] || m[2] || '').trim();
    if (name && (name.endsWith('.jpeg') || name.endsWith('.jpg') || name.endsWith('.JPG') || name.endsWith('.png') || name.includes('/'))) {
      names.push(name);
    }
  }
  return new Set(names);
}

const PROJECT_TO_DATA = [
  { folder: path.join(PROYECTOS, 'ciudades', 'AMVA-USB'), dataFile: 'amva-usb-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'refineriaCartagena'), dataFile: 'refineria-cartagena-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'vivaMagdalena'), dataFile: 'viva-magdalena-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'ARCLAD'), dataFile: 'arclad-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'segovia'), dataFile: 'segovia-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'ccrPalagua'), dataFile: 'ccr-palagua-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'colcafe'), dataFile: 'colcafe-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'cerrejon'), dataFile: 'cerrejon-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'minerosBic'), dataFile: 'mineros-bic-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'pepsico'), dataFile: 'pepsico-images.js' },
  { folder: path.join(PROYECTOS, 'industria', 'spia'), dataFile: 'spia-images.js' },
];

function getAllFiles(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const rel = base ? path.join(base, file) : file;
    if (fs.statSync(full).isDirectory()) {
      results.push(...getAllFiles(full, rel));
    } else {
      results.push(rel);
    }
  }
  return results;
}

function normalizeForCompare(name) {
  return name.replace(/\\/g, '/');
}

let deletedCount = 0;
let deletedBytes = 0;

function deleteFile(fullPath) {
  try {
    const stat = fs.statSync(fullPath);
    deletedBytes += stat.size;
    fs.unlinkSync(fullPath);
    deletedCount++;
    console.log('  Borrado: ' + path.relative(PROYECTOS, fullPath));
  } catch (e) {
    console.error('  Error borrando ' + fullPath, e.message);
  }
}

// 1) Raíz proyectos: mantener solo 360_PEPSICO_60.jpg
const rootFiles = fs.readdirSync(PROYECTOS).filter((f) => f !== 'ciudades' && f !== 'industria' && f !== '.DS_Store');
for (const f of rootFiles) {
  if (f === '360_PEPSICO_60.jpg') continue;
  const full = path.join(PROYECTOS, f);
  if (fs.statSync(full).isFile()) {
    deleteFile(full);
  }
}

// 2) Cada proyecto: mantener solo imágenes en el data file
for (const { folder, dataFile } of PROJECT_TO_DATA) {
  if (!fs.existsSync(folder)) {
    console.log('No existe: ' + folder);
    continue;
  }
  const dataPath = path.join(DATA_DIR, dataFile);
  const allowed = parseImagesFromDataFileSimple(dataPath);
  const allowedNorm = new Set([...allowed].map(normalizeForCompare));

  const allFiles = getAllFiles(folder);
  for (const rel of allFiles) {
    const relNorm = normalizeForCompare(rel);
    const ext = path.extname(rel).toLowerCase();
    // Borrar siempre .ARW, .MOV, .DS_Store
    if (ext === '.arw' || ext === '.mov' || path.basename(rel) === '.DS_Store') {
      deleteFile(path.join(folder, rel));
      continue;
    }
    // Si no es imagen que usamos, borrar
    const inList = allowedNorm.has(relNorm) || allowedNorm.has(rel);
    if (!inList) {
      deleteFile(path.join(folder, rel));
    }
  }
}

// 3) Carpetas vacías (opcional): no las borramos por si hay estructura esperada

console.log('\nTotal archivos borrados: ' + deletedCount);
console.log('Espacio liberado (aprox): ' + (deletedBytes / 1024 / 1024).toFixed(2) + ' MB');

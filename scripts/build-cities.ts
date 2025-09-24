/**
 * Usage:
 * 1) Place a CSV at scripts/input/cities.csv with columns: name,country_code,admin_name
 * 2) npx ts-node scripts/build-cities.ts
 * Outputs JSON files under data/cities/XX.json
 */
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ISO_TARGET = new Set([
  'BJ','BF','CI','GW','ML','NE','SN','TG', // UEMOA
  'CV','GM','GH','GN','LR','NG','SL',     // CEDEAO only
  'CM','CG','GA','TD','CF','GQ'           // CEMAC
]);

const outDir = path.join(process.cwd(), 'data', 'cities');
fs.mkdirSync(outDir, { recursive: true });

const input = path.join(process.cwd(), 'scripts', 'input', 'cities.csv');
const rl = readline.createInterface({ input: fs.createReadStream(input), crlfDelay: Infinity });

const buckets: Record<string, { n: string; a?: string }[]> = {};

let header: string[] = [];
let lineNo = 0;

rl.on('line', (line) => {
  lineNo++;
  if (lineNo === 1) { header = line.split(',').map(h => h.trim()); return; }
  const cols = line.split(','); if (cols.length < 3) return;
  const row: any = {}; header.forEach((h, i) => row[h] = cols[i]);

  const iso = (row.country_code || '').toUpperCase();
  if (!ISO_TARGET.has(iso)) return;

  const name = (row.name || '').trim();
  const admin = (row.admin_name || '').trim();
  if (!name) return;

  (buckets[iso] ||= []).push({ n: name, a: admin || undefined });
});

rl.on('close', () => {
  Object.entries(buckets).forEach(([iso, arr]) => {
    // dédoublonnage & tri
    const map = new Map<string, { n:string; a?:string }>();
    arr.forEach(it => map.set(`${it.n}|${it.a ?? ''}`, it));
    const final = Array.from(map.values()).sort((a,b)=>a.n.localeCompare(b.n,'fr',{sensitivity:'base'}));
    fs.writeFileSync(path.join(outDir, `${iso}.json`), JSON.stringify(final));
    console.log(`→ ${iso}.json  (${final.length} villes)`);
  });
  console.log('✅ Génération terminée');
});
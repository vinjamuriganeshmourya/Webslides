// node src/build.mjs  : bundles the preview into one classic script (so it also opens from disk), writes rig.json and README.md
import fs from 'node:fs';
import path from 'node:path';
import { build } from '../../../../deck-engine/node_modules/esbuild/lib/main.js';

const ROOT = path.resolve(import.meta.dirname, '..');
await build({
  entryPoints: [path.join(ROOT, 'src/main.js')], bundle: true, format: 'iife', minify: true, target: 'es2020',
  outfile: path.join(ROOT, 'char3d.bundle.js'), legalComments: 'eof', logLevel: 'warning',
  alias: { three: path.join(ROOT, 'vendor/three/three.module.js') },
});
const { rigData } = await import('./rigdef.js');
const { buildCharacterData } = await import('./model.js');
const { readme } = await import('./readme.js');
const rig = rigData();
fs.writeFileSync(path.join(ROOT, 'rig.json'), JSON.stringify(rig, null, 1) + '\n');

// facts for the README, measured from the same code the page runs
const t0 = Date.now(), data = buildCharacterData(), buildS = ((Date.now() - t0) / 1000).toFixed(1);
const parts = data.parts, meshes = Object.values(data.meshes);
const tuft = data.specs.findIndex(b => b.name === 'hair-top'), hair = data.meshes.hair, head = data.meshes.head;
let top = 0, chin = 1e9;
for (let i = 0; i < hair.positions.length / 3; i++) if (hair.skinIndices[i * 4] !== tuft && Math.hypot(hair.positions[i * 3] - 1.5, hair.positions[i * 3 + 2] - 0.8) > 3.2) top = Math.max(top, hair.positions[i * 3 + 1]);   // the crown, tuft left out
for (let i = 0; i < head.positions.length / 3; i++) if (Math.abs(head.positions[i * 3]) < 2 && head.positions[i * 3 + 2] > 4) chin = Math.min(chin, head.positions[i * 3 + 1]);
const pkg = p => JSON.parse(fs.readFileSync(path.join(ROOT, '../../../deck-engine/node_modules', p, 'package.json'), 'utf8')).version;
if (meshes.some(m => m.open)) throw new Error('a mesh is not closed: ' + Object.entries(data.meshes).filter(([, m]) => m.open).map(([k]) => k));
const stats = {
  bundleKb: Math.round(fs.statSync(path.join(ROOT, 'char3d.bundle.js')).size / 1024), three: '0.' + fs.readFileSync(path.join(ROOT, 'vendor/three/three.core.js'), 'utf8').match(/REVISION = '(\d+)'/)[1] + '.0',
  esbuild: pkg('esbuild'), playwright: pkg('playwright'), buildS, prims: Object.values(parts).reduce((n, p) => n + p.prims.length, 0), meshes: meshes.length,
  locks: (await import('./headmodel.js')).locks().length, verts: meshes.reduce((n, m) => n + m.positions.length / 3, 0), tris: meshes.reduce((n, m) => n + m.indices.length / 3, 0), height: top.toFixed(1), heads: (top / (top - chin)).toFixed(2),
};
fs.writeFileSync(path.join(ROOT, 'README.md'), readme(rig, data.specs, stats));
console.log(`char3d.bundle.js ${stats.bundleKb} KB | ${data.specs.length} bones | ${rig.joints.length} joints | ${stats.verts} vertices, ${stats.tris} triangles, all closed | ${stats.heads} heads | README.md written`);

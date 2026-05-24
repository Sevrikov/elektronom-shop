import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildManifest, saveManifest } from './node_modules/reversa/lib/installer/manifest.js';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const state = JSON.parse(readFileSync(`${projectRoot}/.reversa/state.json`, 'utf8'));

saveManifest(resolve(projectRoot), buildManifest(resolve(projectRoot), state.created_files));

console.log('Reversa sandbox manifest refreshed.');

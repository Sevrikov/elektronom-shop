import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Writer } from './node_modules/reversa/lib/installer/writer.js';
import { ENGINES } from './node_modules/reversa/lib/installer/detector.js';
import { buildManifest, saveManifest } from './node_modules/reversa/lib/installer/manifest.js';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(projectRoot, 'node_modules', 'reversa', 'package.json'), 'utf8')
);

const agents = [
  'reversa',
  'reversa-scout',
  'reversa-archaeologist',
  'reversa-detective',
  'reversa-architect',
  'reversa-writer',
  'reversa-reviewer',
  'reversa-visor',
  'reversa-data-master',
  'reversa-design-system',
  'reversa-agents-help',
  'reversa-reconstructor',
  'reversa-migrate',
  'reversa-paradigm-advisor',
  'reversa-curator',
  'reversa-strategist',
  'reversa-designer',
  'reversa-inspector',
  'reversa-n8n'
];

const answers = {
  engines: ['codex'],
  agents,
  project_name: 'Elektronom',
  user_name: 'Sevri',
  chat_language: 'ru',
  doc_language: 'ru',
  output_folder: '_reversa_sdd',
  answer_mode: 'chat'
};

const codex = ENGINES.find((engine) => engine.id === 'codex');
if (!codex) {
  throw new Error('Codex engine definition was not found in Reversa.');
}

const writer = new Writer(resolve(projectRoot));

for (const agent of agents) {
  await writer.installSkill(agent, codex.skillsDir);
}

const entryPath = join(projectRoot, codex.entryFile);
if (!existsSync(entryPath)) {
  await writer.installEntryFile(codex);
}

writer.createReversaDir(answers, packageJson.version);
writer.saveCreatedFiles();

saveManifest(resolve(projectRoot), buildManifest(resolve(projectRoot), writer.manifestPaths));

console.log(`Reversa ${packageJson.version} sandbox installed at ${projectRoot}`);
console.log('Engine: codex');
console.log(`Agents: ${agents.length}`);

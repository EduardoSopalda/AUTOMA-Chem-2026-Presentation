import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const act1 = path.join(root, 'act1');

await cp(act1, path.join(dist, 'act1'), { recursive: true });
await cp(path.join(root, 'fonts'), path.join(dist, 'fonts'), { recursive: true });
await cp(path.join(root, 'opening', 'man.png'), path.join(dist, 'opening', 'man.png'), { force: true });

const document = await readFile(path.join(act1, 'act1.html'), 'utf8');
const rootDocument = document.replace('</head>', '  <base href="/act1/">\n</head>');
await writeFile(path.join(dist, 'index.html'), rootDocument);

// Vercel build step: publishes the deck (Act 0 + Acts 1 to 3) as the site root.
// deck.html stacks opening/index.html and act1/act1.html; both keep their own relative paths.
// for-organisers/ forwards to the organiser page on eduardosopalda.com/automa-2026 (one PowerPoint, seven clicks).
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const skip = (list) => (src) => !list.some((name) => src.endsWith(name));

await cp(path.join(root, 'act1'), path.join(dist, 'act1'), { recursive: true, filter: skip(['/src', 'stills.html', 'motion-test.html']) });
await cp(path.join(root, 'opening'), path.join(dist, 'opening'), { recursive: true, filter: skip(['clip2-original.mp4', 'title-slide-original.html']) });
await cp(path.join(root, 'fonts'), path.join(dist, 'fonts'), { recursive: true });
await cp(path.join(root, 'for-organisers'), path.join(dist, 'for-organisers'), { recursive: true });
await rm(path.join(dist, 'index.html'), { force: true });
await cp(path.join(root, 'deck.html'), path.join(dist, 'index.html'));

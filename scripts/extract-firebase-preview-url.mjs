import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const FIREBASE_URL_RE = /https:\/\/[A-Za-z0-9.-]+(?:\.web\.app|\.firebaseapp\.com)(?:\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?/g;

export function extractPreviewUrl(output) {
  const text = String(output ?? '');
  const urls = text.match(FIREBASE_URL_RE) ?? [];
  const preview = urls.find(url => /--/.test(new URL(url).hostname)) ?? urls[0];
  if (!preview) throw new Error('Firebase preview URL not found in deploy output');
  return preview.replace(/[),.;]+$/,'');
}

async function main() {
  const file = process.argv[2];
  const input = file ? await readFile(file,'utf8') : await new Promise((resolve,reject)=>{
    let data=''; process.stdin.setEncoding('utf8'); process.stdin.on('data',c=>data+=c); process.stdin.on('end',()=>resolve(data)); process.stdin.on('error',reject);
  });
  process.stdout.write(extractPreviewUrl(input));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(err=>{console.error(err.message);process.exit(1);});

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.join(__dirname, 'dist');
const dest = path.join(__dirname, '..', 'portfolio-build');
const now = new Date();
const date = now.toISOString().slice(0, 16).replace('T', ' ');

console.log('Pushing source to portfolio repo...');
execSync('git add -A', { cwd: __dirname, stdio: 'inherit' });
try {
execSync(`git commit -m "Source ${date}"`, { cwd: __dirname, stdio: 'inherit' });
execSync('git push', { cwd: __dirname, stdio: 'inherit' });
console.log('Done! Source pushed to portfolio.');
}
catch {
  console.log('No changes to source, skipping push.');
}

console.log('Building...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Copying files...');
fs.cpSync(src, dest, { recursive: true });

console.log('Pushing to GitHub Pages...');
execSync('git add -A', { cwd: dest, stdio: 'inherit' });
try {
  execSync(`git commit -m "Deploy ${date}"`, { cwd: dest, stdio: 'inherit' });
  execSync('git push', { cwd: dest, stdio: 'inherit' });
  console.log('Done! Github pages updated.');
} catch {
  console.log('No changes to deploy, skipping push.');
}

console.log('Done!');
// import { execSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // i should probably just use gh-pages package but oh well, i guess this makes it easier to debug later stuff if i somehow break it
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const customMsg = process.argv[2];

// const src = path.join(__dirname, 'dist');
// const dest = path.join(__dirname, '..', 'portfolio-build');
// const now = new Date();
// const date = now.toISOString().slice(0, 16).replace('T', ' ');

// const commitMsg = customMsg ? `${customMsg} (${date})` : date;

// console.log("Pushing with commit message: ",commitMsg)
// console.log('Pushing source to portfolio repo...');
// execSync('git add -A', { cwd: __dirname, stdio: 'inherit' });
// try {
// execSync(`git commit -m "${commitMsg}" `, { cwd: __dirname, stdio: 'inherit' });
// execSync('git push', { cwd: __dirname, stdio: 'inherit' });
// console.log('Done! Source pushed to portfolio.');
// }
// catch {
//   console.log('No changes to source, skipping push.');
// }

// console.log('Building...');
// execSync('npm run build', { stdio: 'inherit' });

// console.log('Copying files...');
// fs.cpSync(src, dest, { recursive: true });

// console.log('Pushing to GitHub Pages...');
// execSync('git add -A', { cwd: dest, stdio: 'inherit' });
// try {
//   execSync(`git commit -m "${commitMsg}"`, { cwd: dest, stdio: 'inherit' });
//   execSync('git push', { cwd: dest, stdio: 'inherit' });
//   console.log('Done! Github pages updated.');
// } catch {
//   console.log('No changes to deploy, skipping push.');
// }

// console.log('Done!');


import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.join(__dirname, 'dist');
const dest = path.join(__dirname, '..', 'portfolio-build');
const readmePath = path.join(__dirname, 'README.md');

const now = new Date();
const date = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;

// Prompt for commit message
console.log("Add a commit message: ")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const commitMsg = await new Promise(resolve => rl.question('Commit message: ', resolve));
rl.close();

let newVersion;
if (commitMsg.trim()) {
  // Update README.md changelog
  console.log('Updating README.md changelog...');
  let readme = fs.readFileSync(readmePath, 'utf-8');

  const changelogMatch = readme.match(/## Changelog\n(- v0\.0\.(\d+):.*\n)/);
  const lastMinor = parseInt(changelogMatch[2]);
  newVersion = `v0.0.${lastMinor + 1}`;
  const newEntry = `- ${newVersion}: ${date} - ${commitMsg}\n`;
  readme = readme.replace('## Changelog\n', `## Changelog\n${newEntry}`);
  fs.writeFileSync(readmePath, readme, 'utf-8');
  console.log(`Added ${newVersion} to changelog.`);
} else {
  console.log('No commit message provided, skipping changelog update.');
}
// Build
console.log('Building...');
execSync('npm run build', { stdio: 'inherit' });

// Clean portfolio-build
console.log('Cleaning portfolio-build...');
fs.readdirSync(dest).forEach(file => {
  if (file === '.git') return;
  fs.rmSync(path.join(dest, file), { recursive: true, force: true });
});

// Copy dist + README
console.log('Copying files...');
fs.cpSync(src, dest, { recursive: true });
fs.copyFileSync(readmePath, path.join(dest, 'README.md'));

// Push source
console.log('Pushing source to portfolio repo...');
execSync('git add -A', { cwd: __dirname, stdio: 'inherit' });
try {
  execSync(`git commit -m "${newVersion}: ${commitMsg} (${date})"`, { cwd: __dirname, stdio: 'inherit' });
  execSync('git push', { cwd: __dirname, stdio: 'inherit' });
} catch {
  console.log('No source changes to push, skipping.');
}

// Push to GitHub Pages
console.log('Pushing to GitHub Pages...');
execSync('git add -A', { cwd: dest, stdio: 'inherit' });
try {
  execSync(`git commit -m "${newVersion}: ${commitMsg} (${date})"`, { cwd: dest, stdio: 'inherit' });
  execSync('git push', { cwd: dest, stdio: 'inherit' });
  console.log('Done! Changes deployed.');
} catch {
  console.log('No build changes to push, skipping.');
}
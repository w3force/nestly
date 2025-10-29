#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const pnpmDir = path.join(workspaceRoot, 'node_modules', '.pnpm');

if (!fs.existsSync(pnpmDir)) {
  process.exit(0);
}

const candidates = fs.readdirSync(pnpmDir)
  .filter((entry) => entry.startsWith('expo-error-recovery@'))
  .sort();

if (candidates.length === 0) {
  process.exit(0);
}

let applied = false;

for (const candidate of candidates) {
  const gradlePath = path.join(pnpmDir, candidate, 'node_modules', 'expo-error-recovery', 'android', 'build.gradle');
  if (!fs.existsSync(gradlePath)) {
    continue;
  }

  const original = fs.readFileSync(gradlePath, 'utf8');
  let updated = original;
  if (updated.includes("classifier = 'sources'")) {
    updated = updated.replace("classifier = 'sources'", "archiveClassifier.set('sources')");
  }

  if (updated.includes('JavaVersion.VERSION_11')) {
    updated = updated.replace(/JavaVersion\.VERSION_11/g, 'JavaVersion.VERSION_17');
  }

  if (updated.includes('jvmTarget = JavaVersion.VERSION_11.majorVersion')) {
    updated = updated.replace('jvmTarget = JavaVersion.VERSION_11.majorVersion', 'jvmTarget = JavaVersion.VERSION_17.majorVersion');
  }

  if (updated === original) {
    continue;
  }

  fs.writeFileSync(gradlePath, updated, 'utf8');
  console.log(`Patched ${gradlePath}`);
  applied = true;
}

if (applied) {
  console.log('Patched expo-error-recovery Gradle configuration.');
}

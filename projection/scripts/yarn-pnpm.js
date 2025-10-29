#!/usr/bin/env node
const { spawnSync } = require('child_process');

const PNPM_VERSION = process.env.EAS_PNPM_VERSION || '8.15.0';
const args = process.argv.slice(2);
const command = args[0];

function run(cmd, forwardArgs) {
  const result = spawnSync(cmd, forwardArgs, { stdio: 'inherit', shell: false });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensurePnpm() {
  run('corepack', ['prepare', `pnpm@${PNPM_VERSION}`, '--activate']);
}

function runPnpm(pnpmArgs) {
  run('pnpm', pnpmArgs);
}

ensurePnpm();

if (!command || command === 'install') {
  runPnpm(['install', ...args.slice(1)]);
} else if (command === 'run') {
  const script = args[1];
  if (!script) {
    process.exit(0);
  }
  runPnpm(['exec', script, ...args.slice(2)]);
} else {
  runPnpm(['exec', command, ...args.slice(1)]);
}

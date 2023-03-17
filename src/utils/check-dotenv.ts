import * as fs from 'fs';

import { logger } from 'infrastructure';


const envExample = fs.readFileSync('.env.example', 'utf8');

const exampleVars = new Set(envExample.split('\n').map((v) => v.split('=')[0]).filter(Boolean));
const vars = new Set(Object.keys(process.env));

const missingVars: string[] = [];

for (const v of exampleVars.values()) {
  if (!vars.has(v)) {
    missingVars.push(v);
  }
}

if (missingVars.length > 0) {
  logger.error(`❗️ Some environment variables are missing: ${missingVars.join(', ')}`);
}

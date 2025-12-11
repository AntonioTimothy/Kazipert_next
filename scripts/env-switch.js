const fs = require('fs');
const path = require('path');

const environments = {
  test: '.env.test',
  live: '.env.live',
  development: '.env'
};

function switchEnvironment(env) {
  if (!environments[env]) {
    console.error(`Environment ${env} not found. Available: ${Object.keys(environments).join(', ')}`);
    process.exit(1);
  }

  const sourceEnv = path.join(__dirname, '..', environments[env]);
  const targetEnv = path.join(__dirname, '..', '.env');

  if (!fs.existsSync(sourceEnv)) {
    console.error(`Source environment file ${sourceEnv} not found`);
    process.exit(1);
  }

  // Copy the environment file
  fs.copyFileSync(sourceEnv, targetEnv);
  console.log(`Switched to ${env} environment`);
}

const targetEnv = process.argv[2] || 'development';

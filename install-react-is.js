const { execSync } = require('child_process');
const path = require('path');

const BASE_DIR = '/Users/foysal/Documents/FOYSAL/Projects';
const repos = [
  'super-admin-dashboard',
  'pet-hotel-admin-dashboard',
  'vendor-admin',
  'pet-sitter-admin-dashboard',
  'pet-school-admin',
  'owner-dashboard'
];

repos.forEach(repo => {
  console.log(`Installing react-is in ${repo}...`);
  try {
    execSync('npm install react-is --legacy-peer-deps', { 
      cwd: path.join(BASE_DIR, repo),
      stdio: 'inherit'
    });
  } catch (err) {
    console.error(`Failed to install in ${repo}`);
  }
});

#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Supabase Setup Helper for Rapchai Restaurant Management System\n');

// Check if .env files exist
const rootEnvPath = path.join(__dirname, '.env');
const backendEnvPath = path.join(__dirname, 'backend', '.env');

console.log('📋 Checking environment files...');

if (!fs.existsSync(rootEnvPath)) {
  console.log('❌ Root .env file not found');
  console.log('📝 Please create .env file in the root directory with:');
  console.log('   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"');
} else {
  console.log('✅ Root .env file exists');
}

if (!fs.existsSync(backendEnvPath)) {
  console.log('❌ Backend .env file not found');
  console.log('📝 Please create backend/.env file with Supabase configuration');
} else {
  console.log('✅ Backend .env file exists');
}

console.log('\n🔧 Next steps:');
console.log('1. Create a Supabase project at https://supabase.com');
console.log('2. Get your database connection string');
console.log('3. Update your .env files with the connection string');
console.log('4. Run: npx prisma generate');
console.log('5. Run: npx prisma migrate dev --name init');
console.log('6. Run: npm run prisma:seed');

console.log('\n📚 For detailed instructions, see SUPABASE_SETUP.md');

// Check if Prisma is installed
try {
  execSync('npx prisma --version', { stdio: 'pipe' });
  console.log('\n✅ Prisma CLI is available');
} catch (error) {
  console.log('\n❌ Prisma CLI not found. Installing...');
  try {
    execSync('npm install prisma @prisma/client', { stdio: 'inherit' });
    console.log('✅ Prisma installed successfully');
  } catch (installError) {
    console.log('❌ Failed to install Prisma:', installError.message);
  }
}

console.log('\n🎉 Setup helper completed!');

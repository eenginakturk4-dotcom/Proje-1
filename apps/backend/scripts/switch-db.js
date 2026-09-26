const fs = require('fs');
const path = require('path');

const target = process.argv[2] || 'sqlite';
const backendDir = path.resolve(__dirname, '..');
const prismaDir = path.join(backendDir, 'prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');
const envPath = path.join(backendDir, '.env');

if (target === 'sqlite') {
  const sqliteSchema = path.join(prismaDir, 'schema.sqlite.prisma');
  if (fs.existsSync(sqliteSchema)) {
    fs.copyFileSync(sqliteSchema, schemaPath);
    console.log('🔄 Switched schema.prisma to SQLite provider.');
  }

  // Update or create .env with SQLite URL
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else {
    const envExamplePath = path.join(backendDir, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      envContent = fs.readFileSync(envExamplePath, 'utf8');
    }
  }

  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(/DATABASE_URL=".*?"/, 'DATABASE_URL="file:./dev.db"');
    envContent = envContent.replace(/DATABASE_URL=.*(\r?\n|$)/, 'DATABASE_URL="file:./dev.db"$1');
  } else {
    envContent += '\nDATABASE_URL="file:./dev.db"\n';
  }

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('📁 Updated .env DATABASE_URL to "file:./dev.db"');
} else if (target === 'postgres') {
  let content = fs.readFileSync(schemaPath, 'utf8');
  content = content.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('🔄 Switched schema.prisma to PostgreSQL provider.');

  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    const postgresUrl = 'postgresql://postgres:postgres@localhost:5432/shoppy_dev?schema=public';
    envContent = envContent.replace(/DATABASE_URL=".*?"/, `DATABASE_URL="${postgresUrl}"`);
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`📁 Updated .env DATABASE_URL to PostgreSQL.`);
  }
}

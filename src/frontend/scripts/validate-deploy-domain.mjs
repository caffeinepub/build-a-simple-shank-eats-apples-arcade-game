import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DOMAIN_FILE = join(process.cwd(), 'deploy', 'domain.txt');
const DOMAIN_REGEX = /^[a-z0-9-]{5,50}$/;

function validateDomain() {
  console.log('🔍 Validating deployment domain configuration...\n');

  // Check if domain file exists
  if (!existsSync(DOMAIN_FILE)) {
    console.error('❌ Error: deploy/domain.txt not found.');
    console.error('📝 Please create the file with a valid domain name.');
    console.error('   Example: shank-eats-apples-game\n');
    process.exit(1);
  }

  // Read domain from file
  let domain;
  try {
    domain = readFileSync(DOMAIN_FILE, 'utf-8').trim();
  } catch (err) {
    console.error('❌ Error reading deploy/domain.txt:', err.message);
    process.exit(1);
  }

  // Check if domain is empty
  if (!domain) {
    console.error('❌ Error: deploy/domain.txt is empty.');
    console.error('📝 Please add a valid domain name.');
    console.error('   Example: shank-eats-apples-game\n');
    process.exit(1);
  }

  // Check for quotes
  if (domain.includes('"') || domain.includes("'") || domain.includes('`')) {
    console.error('❌ Error: Domain contains quote characters.');
    console.error(`   Found: ${domain}`);
    console.error('📝 Remove all quotes from the domain name.');
    console.error('   Example: shank-eats-apples-game (no quotes)\n');
    process.exit(1);
  }

  // Validate domain format
  if (!DOMAIN_REGEX.test(domain)) {
    console.error('❌ Error: Invalid domain format.');
    console.error(`   Found: ${domain}`);
    console.error('\n📝 Domain requirements:');
    console.error('   - Only lowercase letters (a-z)');
    console.error('   - Numbers (0-9)');
    console.error('   - Hyphens (-)');
    console.error('   - Length: 5-50 characters');
    console.error('   - No spaces, quotes, or special characters');
    console.error('\n   Valid example: shank-eats-apples-game\n');
    process.exit(1);
  }

  // Success
  console.log('✅ Domain validation passed!');
  console.log(`📍 Domain: ${domain}`);
  console.log(`📏 Length: ${domain.length} characters`);
  console.log('\n🚀 Domain is ready for deployment.\n');
}

validateDomain();

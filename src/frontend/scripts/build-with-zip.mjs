import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const DIST_DIR = join(process.cwd(), 'dist');

console.log('🚀 Starting production build with ZIP export...\n');

try {
  // Step 1: Run the production build
  console.log('📦 Building frontend...');
  execSync('pnpm build:skip-bindings', { stdio: 'inherit' });
  
  // Verify dist exists
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Error: Build failed - dist/ directory not found.');
    process.exit(1);
  }
  
  console.log('\n✅ Frontend build complete!\n');
  
  // Step 2: Generate ZIP automatically
  console.log('🎮 Generating ZIP export...\n');
  execSync('node frontend/scripts/export-zip.mjs', { stdio: 'inherit' });
  
  console.log('\n🎉 Production build with ZIP export complete!');
  console.log('📦 Your game is ready to deploy.');
  console.log('🌐 The ZIP will be available at /shank-game.zip after deployment.\n');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}

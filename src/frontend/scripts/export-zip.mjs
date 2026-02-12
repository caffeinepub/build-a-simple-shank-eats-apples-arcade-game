import { createWriteStream, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import archiver from 'archiver';

const DIST_DIR = join(process.cwd(), 'dist');
const EXPORT_DIR = join(process.cwd(), 'export');
const OUTPUT_ZIP = join(EXPORT_DIR, 'shank-game.zip');
const DIST_ZIP = join(DIST_DIR, 'shank-game.zip');

async function createZip() {
  console.log('🎮 Starting ZIP export for Shank Game...\n');

  // Check if dist exists
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Error: dist/ directory not found.');
    console.error('📝 Please run the production build first:');
    console.error('   pnpm build\n');
    process.exit(1);
  }

  // Create export directory if it doesn't exist
  if (!existsSync(EXPORT_DIR)) {
    console.log('📁 Creating export directory...');
    mkdirSync(EXPORT_DIR, { recursive: true });
  }

  // Create ZIP archive
  const output = createWriteStream(OUTPUT_ZIP);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  // Handle errors
  output.on('error', (err) => {
    console.error('❌ Output stream error:', err);
    process.exit(1);
  });

  archive.on('error', (err) => {
    console.error('❌ Archive error:', err);
    process.exit(1);
  });

  // Track progress
  archive.on('progress', (progress) => {
    const percent = ((progress.entries.processed / progress.entries.total) * 100).toFixed(1);
    process.stdout.write(`\r📦 Compressing: ${percent}% (${progress.entries.processed}/${progress.entries.total} files)`);
  });

  // Pipe archive to output file
  archive.pipe(output);

  // Add all files from dist directory
  console.log('📂 Adding files from dist/...');
  archive.directory(DIST_DIR, false);

  // Finalize the archive
  await archive.finalize();

  // Wait for output stream to finish
  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    output.on('error', reject);
  });

  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`\n\n✅ ZIP created successfully!`);
  console.log(`📍 Location: ${OUTPUT_ZIP}`);
  console.log(`📊 Size: ${sizeInMB} MB`);

  // Copy ZIP to dist directory for deployment
  console.log('\n📋 Copying ZIP to dist/ for deployment...');
  try {
    copyFileSync(OUTPUT_ZIP, DIST_ZIP);
    console.log(`✅ Deployable ZIP created: ${DIST_ZIP}`);
    console.log(`🌐 After deployment, the ZIP will be available at: /shank-game.zip`);
  } catch (err) {
    console.error('❌ Failed to copy ZIP to dist/:', err.message);
    process.exit(1);
  }

  console.log(`\n🚀 Your game is ready to upload to PlayStory or any static hosting platform!`);
}

createZip().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});

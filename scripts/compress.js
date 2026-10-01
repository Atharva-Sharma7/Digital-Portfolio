const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../../split');
const outputDirDesktop = path.join(__dirname, '../public/sequence/desktop');
const outputDirMobile = path.join(__dirname, '../public/sequence/mobile');

// Ensure output directories exist
[outputDirDesktop, outputDirMobile].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function processImages() {
  try {
    const files = fs.readdirSync(inputDir).filter(file => file.match(/\.(png|jpg|jpeg)$/i));
    console.log(`Found ${files.length} images to process.`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const inputPath = path.join(inputDir, file);
      
      // Standardize output name (e.g., ezgif-frame-001.png -> 0001.webp)
      const indexStr = (i + 1).toString().padStart(4, '0');
      const outputFilename = `${indexStr}.webp`;
      
      const desktopPath = path.join(outputDirDesktop, outputFilename);
      const mobilePath = path.join(outputDirMobile, outputFilename);

      // Desktop: 1920px max width, quality ~70
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toFile(desktopPath);

      // Mobile: 1280px max width, quality ~70 (only every 2nd frame to save size, or we could do all frames and filter in frontend. Let's do all frames here for flexibility, frontend can skip)
      // Actually, user requested "mobile frame reduction (every 2nd frame)". We can skip saving every 2nd frame in mobile!
      if (i % 2 === 0) {
        await sharp(inputPath)
          .resize({ width: 1280, withoutEnlargement: true })
          .webp({ quality: 70 })
          .toFile(mobilePath);
      }

      console.log(`Processed ${file} -> ${outputFilename} (Progress: ${Math.round(((i + 1) / files.length) * 100)}%)`);
    }

    console.log('Image sequence processing complete!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();

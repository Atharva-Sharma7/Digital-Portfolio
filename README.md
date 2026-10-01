# Atharva Sharma - 3D Portfolio

A cinematic, experimental, premium 3D portfolio designed to feel like a hybrid of a VLSI laboratory, futuristic command center, and digital data universe.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber / Drei
- HTML5 Canvas & WebP Sequence (Sharp)
- Lenis Smooth Scrolling

## Setup Instructions

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Compress Frame Sequence
Place your raw frame sequence in the `../split` directory (relative to this app).
Then run the compression script to generate optimized WebP frames:
```bash
node scripts/compress.js
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## Performance & Optimizations
- Sequence frames are converted to `.webp` with quality ~70.
- Canvas uses manual `object-fit: cover` mapping without React re-renders.
- 3D elements dynamically imported and disabled on mobile devices.
- Lenis scrolling runs on `requestAnimationFrame` loop outside React lifecycle.

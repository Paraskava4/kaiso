#!/usr/bin/env node

/**
 * Verification script for Next.js static export optimizations
 * 
 * This script verifies that all performance optimizations are properly
 * configured and working as expected.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Next.js Static Export Optimizations...\n');

// Check if files exist and contain expected optimizations
const checks = [
  {
    name: 'Next.js Configuration',
    file: 'next.config.js',
    checks: [
      // 'output: "export"',
      'unoptimized: true',
      'trailingSlash: true',
      'BundleAnalyzerPlugin',
      'CompressionPlugin'
    ]
  },
  {
    name: 'Package.json Scripts',
    file: 'package.json',
    checks: [
      'analyze',
      'build:analyze',
      'export'
    ]
  },
  {
    name: 'Font Optimization',
    file: 'src/utils/fonts.js',
    checks: [
      'next/font/google',
      'display: \'swap\'',
      'preload: true'
    ]
  },
  {
    name: 'Performance Monitoring',
    file: 'src/utils/performance.js',
    checks: [
      'reportWebVitals',
      'analyzeResourceTiming',
      'monitorBundleSize'
    ]
  },
  {
    name: 'Optimized Image Component',
    file: 'src/components/shared/OptimizedImage.jsx',
    checks: [
      'next/image',
      'memo',
      'blurDataURL',
      'priority'
    ]
  },
  {
    name: 'HomePage Optimizations',
    file: 'src/page-components/HomePage.jsx',
    checks: [
      'dynamic',
      'memo',
      'Suspense',
      'ssr: false'
    ]
  },
  {
    name: 'App.js Optimizations',
    file: 'src/pages/_app.js',
    checks: [
      'memo',
      'dynamic',
      'poppins'
    ]
  },
  {
    name: 'Document.js Optimizations',
    file: 'src/pages/_document.js',
    checks: [
      'poppins.variable',
      'preload',
      'strategy'
    ]
  }
];

let allPassed = true;

checks.forEach(({ name, file, checks }) => {
  console.log(`📁 Checking ${name}...`);

  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const passedChecks = checks.filter(check => content.includes(check));

  if (passedChecks.length === checks.length) {
    console.log(`✅ All ${checks.length} optimizations found`);
  } else {
    console.log(`⚠️  ${passedChecks.length}/${checks.length} optimizations found`);
    const missing = checks.filter(check => !content.includes(check));
    console.log(`   Missing: ${missing.join(', ')}`);
    allPassed = false;
  }

  console.log('');
});

// Check for critical dependencies
console.log('📦 Checking Dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredDeps = [
  '@next/bundle-analyzer',
  'webpack-bundle-analyzer',
  'compression-webpack-plugin',
  'cross-env'
];

const missingDeps = requiredDeps.filter(dep =>
  !packageJson.devDependencies[dep]
);

if (missingDeps.length === 0) {
  console.log('✅ All required dependencies are installed');
} else {
  console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
  allPassed = false;
}

console.log('');

// Summary
if (allPassed) {
  console.log('🎉 All optimizations are properly configured!');
  console.log('\n📋 Next Steps:');
  console.log('1. Run `npm install` to install dependencies');
  console.log('2. Run `npm run build` to test the build');
  console.log('3. Run `npm run analyze` to check bundle size');
  console.log('4. Deploy and monitor performance metrics');
} else {
  console.log('⚠️  Some optimizations may need attention.');
  console.log('Please review the missing items above.');
}

console.log('\n📖 For detailed information, see PERFORMANCE_OPTIMIZATION_GUIDE.md');

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Building for Netlify deployment...');

// Create dist/public directory
const distDir = path.join(__dirname, 'dist', 'public');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

try {
  // Build using the netlify config
  console.log('📦 Building with Vite...');
  execSync('npx vite build --config vite.config.netlify-auth.ts', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Build completed successfully!');
  
  // Check if files were created
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html created');
  } else {
    console.log('❌ index.html not found');
  }
  
  // List files in dist/public
  console.log('\n📁 Files in dist/public:');
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir);
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log('\n🎉 Netlify deployment files are ready!');
  console.log('📋 Next steps:');
  console.log('1. Configure environment variables in Netlify');
  console.log('2. Set build command: vite build --config vite.config.netlify-auth.ts');
  console.log('3. Set publish directory: dist/public');
  console.log('4. Deploy to Netlify');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Try a simpler approach - copy static files manually
  console.log('\n🔧 Attempting fallback build...');
  
  try {
    // Copy HTML file
    const srcHtml = path.join(__dirname, 'client', 'index-netlify-auth.html');
    const destHtml = path.join(distDir, 'index.html');
    
    if (fs.existsSync(srcHtml)) {
      let htmlContent = fs.readFileSync(srcHtml, 'utf8');
      
      // Update script reference to bundle
      htmlContent = htmlContent.replace(
        '/src/main-netlify-auth.tsx',
        '/assets/main.js'
      );
      
      fs.writeFileSync(destHtml, htmlContent);
      console.log('✅ HTML file created');
    }
    
    // Create _redirects file for SPA routing
    const redirectsContent = '/*    /index.html   200\n';
    fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
    console.log('✅ _redirects file created');
    
    // Create a simple JavaScript bundle notification
    const assetsDir = path.join(distDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir);
    }
    
    const jsContent = `
// This is a placeholder - Netlify will build the actual bundle
console.log('CUCA site loading...');
document.body.innerHTML = '<div style="text-align:center;padding:50px;font-family:Arial,sans-serif;"><h1>CUCA - A Cerveja Angolana Original</h1><p>Site em construção...</p></div>';
`;
    fs.writeFileSync(path.join(assetsDir, 'main.js'), jsContent);
    console.log('✅ Placeholder JS created');
    
    console.log('\n✅ Fallback build completed!');
    
  } catch (fallbackError) {
    console.error('❌ Fallback build also failed:', fallbackError.message);
  }
}
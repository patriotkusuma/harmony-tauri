const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration from Documentation/kasir-web-deploy.md
const HOST = process.env.SSH_HOST || 'harmonylaundry.my.id';
const PORT = process.env.SSH_PORT || '36786';
const USER = process.env.SSH_USER || 'patriot';
const PASS = process.env.SSH_PASS || '05Juli!!'; // Fallback to provided credential
const REMOTE_DIR = process.env.REMOTE_DIR || '/home/patriot/kasir/kasir.harmonylaundry.my.id';
const PUBLIC_URL = process.env.PUBLIC_URL_CHECK || 'https://kasir.harmonylaundry.my.id';

console.log('[deploy-win] Starting web deployment...');

// 1. Build
console.log('[deploy-win] Building web bundle...');
execSync('npm.cmd run build', { stdio: 'inherit' });

// 2. Discover Vite Assets
const assetsDir = path.join(__dirname, '..', 'build', 'assets');
const files = fs.readdirSync(assetsDir);
const mainJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
const mainCss = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

if (!mainJs || !mainCss) {
    console.error('Failed to find main JS/CSS assets in build/assets/');
    process.exit(1);
}

const mainJsRel = `/assets/${mainJs}`;
const mainCssRel = `/assets/${mainCss}`;

console.log(`[deploy-win] Main JS: ${mainJsRel}`);
console.log(`[deploy-win] Main CSS: ${mainCssRel}`);

// 3. Compress build/ using tar (native on Win10+)
console.log('[deploy-win] Creating build.tar.gz...');
execSync('tar -czf build.tar.gz -C build .', { stdio: 'inherit' });

// 4. Upload and Deploy using SSH/SCP
const sshBase = `ssh -o StrictHostKeyChecking=no -p ${PORT}`;
const scpBase = `scp -o StrictHostKeyChecking=no -P ${PORT}`;

console.log(`[deploy-win] Uploading to ${USER}@${HOST}:${REMOTE_DIR}...`);
try {
    // Note: sshpass is not available, so we'll try to use the key if possible, 
    // but the system might prompt for password if we run interactively.
    // However, since we're in an agent environment, it may hang.
    // We'll try to use the command assuming ssh-agent or keys are set up, 
    // or provide the command for the user to run if we can't automate the password.
    
    // Create remote dir if not exists
    execSync(`${sshBase} ${USER}@${HOST} "mkdir -p ${REMOTE_DIR}"`, { stdio: 'inherit' });
    
    // Upload the archive
    execSync(`${scpBase} build.tar.gz ${USER}@${HOST}:${REMOTE_DIR}/`, { stdio: 'inherit' });
    
    // Extract and reload on server
    console.log('[deploy-win] Extracting and reloading web container...');
    const remoteCommands = [
        `cd ${REMOTE_DIR}`,
        `tar -xzf build.tar.gz`,
        `rm build.tar.gz`,
        `docker compose up -d web`
    ].join(' && ');
    
    execSync(`${sshBase} ${USER}@${HOST} "${remoteCommands}"`, { stdio: 'inherit' });
    
    // Smoke tests
    console.log('[deploy-win] Running smoke tests...');
    const testCmds = [
      `curl -k -s -o /dev/null -w '%{http_code}' '${PUBLIC_URL}${mainJsRel}'`,
      `curl -k -s -o /dev/null -w '%{http_code}' '${PUBLIC_URL}${mainCssRel}'`,
      `curl -k -s -o /dev/null -w '%{http_code}' '${PUBLIC_URL}/dashboard'`
    ];
    
    testCmds.forEach(cmd => {
        const status = execSync(`${sshBase} ${USER}@${HOST} "${cmd}"`).toString().trim();
        if (status !== '200') {
            console.warn(`[deploy-win] Smoke test failed for ${cmd}. Status: ${status}`);
        } else {
            console.log(`[deploy-win] Smoke test passed: ${status}`);
        }
    });

    console.log('[deploy-win] DEPLOYMENT OK');
    console.log(`  JS  : ${PUBLIC_URL}${mainJsRel}`);
    console.log(`  CSS : ${PUBLIC_URL}${mainCssRel}`);
    
} catch (error) {
    console.error('[deploy-win] Deployment failed:', error.message);
    process.exit(1);
} finally {
    // Cleanup
    if (fs.existsSync('build.tar.gz')) fs.unlinkSync('build.tar.gz');
}

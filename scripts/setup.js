#!/usr/bin/env node

const { execSync } = require('child_process');
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

try {
    // Create necessary directories
    const dirs = ['.ns-plugins', 'node_modules/.bin'];
    dirs.forEach(dir => {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    });

    // Create ns command file
    const nsScript = join('node_modules', '.bin', 'ns');
    const nsContent = `#!/usr/bin/env node
require('@nativescript/preview-cli').run();`;

    writeFileSync(nsScript, nsContent, { encoding: 'utf8', mode: 0o755 });

    console.log('NativeScript environment setup completed successfully!');
} catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
}
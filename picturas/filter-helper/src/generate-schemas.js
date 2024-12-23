/* eslint no-console: 0 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const [outputFile, ...folders] = process.argv.slice(2);

if (!outputFile || folders.length === 0) {
    console.error('Usage: node script.js <outputFile> <folder1> <folder2> ...');
    process.exit(1);
}

const resolvedOutputPath = resolve(outputFile);

if (existsSync(resolvedOutputPath)) {
    try {
        unlinkSync(resolvedOutputPath);
    } catch (error) {
        console.error(
            `Error removing schema file: ${resolvedOutputPath}`,
            error.message,
        );
        process.exit(1);
    }
}

writeFileSync(resolvedOutputPath, '{}');

folders.forEach((folder) => {
    const resolvedFolder = resolve(folder);
    console.log(`Processing folder: ${resolvedFolder}`);

    try {
        execSync(`npm run start -- ${resolvedOutputPath}`, {
            cwd: resolvedFolder,
            env: {
                ...process.env,
                EXPORT_SCHEMA: 'true',
            },
            stdio: 'inherit',
        });
    } catch (error) {
        console.error(
            `Error processing folder: ${resolvedFolder}`,
            error.message,
        );
    }
});

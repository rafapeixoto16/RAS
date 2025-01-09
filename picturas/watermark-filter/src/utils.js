import { execa } from 'execa';
import * as os from 'os';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const isWindows = os.platform() === 'win32';

export const venvDir = path.resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../venv'
);

export const watermarkPath = path.resolve(
    venvDir,
    isWindows ? 'Scripts/watermark.exe' : 'bin/watermark'
);

export async function findSystemPython() {
    const findPath = isWindows ? 'where' : 'which';
    const pythonNames = ['python3', 'python'];

    // windows has python3 in path but does microsoft store funny
    // which does stderr so lets try catch

    for (const pythonName of pythonNames) {
        try {
            const pythonPath = (
                await execa(findPath, [pythonName])
            ).stdout.split('\n')[0]; // windows shows multiple lines

            if (pythonPath.includes('not found')) continue; // linux or mac
            if (pythonPath.includes('not find')) continue; // windows

            const pythonVersion = (await execa(pythonPath, ['--version']))
                .stdout;

            if (!pythonVersion.includes('Python 3.')) continue;

            return pythonPath;
        } catch (error) {
            /* empty */
        }
    }

    return null;
}

import { execa } from 'execa';
import * as fs from 'fs/promises';
import { findSystemPython, venvDir, venvPythonPath } from './utils.js';

(async () => {
    const systemPythonPath = await findSystemPython();
    if (systemPythonPath == null) {
        throw new Error('Python not found. Please make sure its installed');
    }

    await fs.mkdir(venvDir, { recursive: true });

    await execa(systemPythonPath, ['-m', 'venv', venvDir], {
        stdout: 'inherit',
        stderr: 'inherit',
    });

    await execa(venvPythonPath, ['-m', 'pip', 'install', 'poetry==1.8'], {
        stdout: 'inherit',
        stderr: 'inherit',
        env: {
            VIRTUAL_ENV: venvDir,
        },
    });

    await execa(venvPythonPath, ['-m', 'poetry', 'install'], {
        cwd: 'picturas-watermark-tool-ms',
        stdout: 'inherit',
        stderr: 'inherit',
        env: {
            VIRTUAL_ENV: venvDir,
        },
    });
})();

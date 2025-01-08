import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import { findSystemPython, isWindows, venvDir } from './utils.js';

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

    const venvPythonPath = path.resolve(
        venvDir,
        isWindows ? 'Scripts/python.exe' : 'bin/python'
    );

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

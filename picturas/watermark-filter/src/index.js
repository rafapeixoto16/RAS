// Thanks to transparent-background for the bulk of the js code

import execa from 'execa';
import { watermarkPath, venvDir } from './utils';

(async () => {
    await execa(watermarkPath, ['-m', 'picturas_watermark_tool_ms.main'], {
        path: 'picturas-watermark-tool-ms',
        reject: false,
        env: {
            VIRTUAL_ENV: venvDir,
        },
    });
})();

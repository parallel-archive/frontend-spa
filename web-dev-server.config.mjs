import { esbuildPlugin } from '@web/dev-server-esbuild'
import proxy from 'koa-proxies'

import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';

const commonjs = fromRollup(rollupCommonjs);


export default {
    open: false,
    nodeResolve: true,
    appIndex: 'src/index.html',
    rootDir: 'src/',
    watch: true,

    plugins: [
        // commonjs({
        //     include: [
        //         // the commonjs plugin is slow, list the required packages explicitly:
        //         '**/node_modules/heic2any/dist/**',
        //     ],
        // }),
        esbuildPlugin({
            ts: true,
            target: 'esnext',
            sourcemap: true
        })
    ],

    middleware: [
        proxy('/api', {
            target: 'https://app.osa.codeandsoda.hu/',
            changeOrigin: true
        }),
    ],
};
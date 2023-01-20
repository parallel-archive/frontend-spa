import esbuild from 'esbuild'
import fs from 'fs-extra'
import { minifyHTMLLiterals } from 'minify-html-literals'

const transformTS = {
    name: 'minifyHTMLandCSS',
    setup(build) {
        build.onLoad({ filter: /\.ts$/ }, async (args) => {
            let ts = await fs.promises.readFile(args.path, 'utf8')
            ts = ts.split('__PARENT_SITE_URL__').join(process.env.PARENT_SITE_URL || 'https://osa.codeandsoda.hu')
            const minified = minifyHTMLLiterals(ts)
            if (minified) ts = minified.code
            return {
                contents: ts,
                loader:'ts'
            }
        })
    },
}

fs.emptyDirSync('dist')

esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: 'dist/main.js',
    plugins: [transformTS],
    legalComments: 'none',
})
    .catch(() => process.exit(1))
    .then(() => {

        let indexhtml = fs.readFileSync('src/index.html', { encoding: 'utf-8' })
        indexhtml = indexhtml.replace('main.ts', 'main.js')
        const UMAMI_SITE_ID = process.env.UMAMI_SITE_ID || 'afd4d82b-ddec-4fb3-9499-f3c20c0b480c'
        const UMAMI_SCRIPT_URL = process.env.UMAMI_SCRIPT_URL || 'https://osa.codeandsoda.hu/umami/umami.js'
        indexhtml = indexhtml.replace('__UMAMI_SITE_ID__', UMAMI_SITE_ID)
        indexhtml = indexhtml.replace('__UMAMI_SCRIPT_URL__', UMAMI_SCRIPT_URL)
        // Production: <script async defer data-website-id="d070a03c-7880-4c37-b4dc-47b115413fa9" src="https://app.test.parallelarchive.org/umami/umami.js"></script>
        fs.writeFileSync('dist/index.html', indexhtml, { encoding: 'utf-8' })

        fs.copyFileSync('src/style.css', 'dist/style.css')
        fs.copyFileSync('src/favicon.ico', 'dist/favicon.ico')
        fs.emptyDirSync('dist/static')
        fs.copySync('src/static', 'dist/static')
    })


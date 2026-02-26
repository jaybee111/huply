import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import { resolve } from 'path'
// import { peerDependencies, dependencies } from './package.json'

function mockBackendPlugin() {
    const uploadedFiles = new Set();

    return {
        name: 'mock-backend',
        configureServer(server) {
            server.middlewares.use('/api/mock-upload', (req, res) => {
                if (req.method === 'POST') {
                    const bodyChunks = [];
                    req.on('data', (chunk) => bodyChunks.push(chunk));
                    req.on('end', () => {
                        const url = new URL(req.url, 'http://localhost');
                        const failRate = parseFloat(url.searchParams.get('fail_rate') ?? '0');
                        if (failRate > 0 && Math.random() < failRate) {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: 'simulated failure' }));
                            return;
                        }

                        // Extract original filename from multipart Content-Disposition
                        const body = Buffer.concat(bodyChunks).toString('latin1');
                        const dispositionMatch = body.match(/Content-Disposition: form-data;[^\r\n]*filename="([^"]+)"/i);
                        let filename = dispositionMatch ? dispositionMatch[1] : 'upload';

                        // If filename already taken, append a random suffix before the extension
                        if (uploadedFiles.has(filename)) {
                            const dot = filename.lastIndexOf('.');
                            const rand = Math.random().toString(36).slice(2, 8);
                            filename = dot !== -1
                                ? filename.slice(0, dot) + '-' + rand + filename.slice(dot)
                                : filename + '-' + rand;
                        }

                        const contentRange = req.headers['content-range'];
                        if (contentRange) {
                            const match = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/);
                            if (match) {
                                const isFinal = parseInt(match[2]) === parseInt(match[3]);
                                console.log(`[mock] chunk ${contentRange}${isFinal ? ' (final)' : ''}`);
                                // Mark as taken only when the last chunk arrives
                                if (isFinal) uploadedFiles.add(filename);
                            }
                        } else {
                            console.log(`[mock] regular upload → ${filename}`);
                            uploadedFiles.add(filename);
                        }

                        res.setHeader('Content-Type', 'application/json');
                        res.statusCode = 200;
                        res.end(JSON.stringify({ filename }));
                    });
                } else if (req.method === 'DELETE') {
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.statusCode = 405;
                    res.end();
                }
            });
        }
    };
}

export default defineConfig({
    plugins: [mockBackendPlugin(), eslintPlugin({ cache: false })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            // for UMD name: 'GlobalName'
            formats: ['es', 'cjs'],
            fileName: (format) => `huply.${format}.js`,
        },
        /*
        rollupOptions: {
            external: [...Object.keys(peerDependencies), ...Object.keys(dependencies)]
        },
        */
        sourcemap: true,
    }
});

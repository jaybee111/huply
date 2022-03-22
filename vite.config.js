import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import { resolve } from 'path'
// import { peerDependencies, dependencies } from './package.json'


export default defineConfig({
    plugins: [eslintPlugin({ cache: false })],
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

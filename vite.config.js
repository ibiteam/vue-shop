import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl';
import { createHtmlPlugin } from 'vite-plugin-html';

const getEnv = (mode, target) => {
    return loadEnv(mode, process.cwd())[target]
}
export default ({ mode }) => {
    const is_https = getEnv(mode, 'VITE_APP_URL').includes('https')
    const is_dev = getEnv(mode, 'VITE_APP_CURRENTMODE') == 'dev'
    const is_prod = getEnv(mode, 'VITE_APP_CURRENTMODE') == 'prod'
    return defineConfig({
        plugins: [
            vue({ reactivityTransform: true }),
            is_dev && vueDevTools(),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        title: getEnv(mode, 'VITE_APP_NAME'),
                        logo: getEnv(mode, 'VITE_APP_LOGO'),
                    }
                }
            }),
            is_https && basicSsl()
        ],
        base: '/',
        publicDir: 'public',
        resolve: {
            alias: {
                // 路径别名
                '@': path.resolve(__dirname, 'src'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@components': path.resolve(__dirname, 'src/components'),
            },
            extensions: ['.vue', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
        },
        server: {
            host: getEnv(mode, 'VITE_APP_DOMAIN'),
            open: true,
            strictPort: false,
            https: is_https,
            proxy: {
                '/api': {
                    target: getEnv(mode, 'VITE_APP_URL'),
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        }
    })
}


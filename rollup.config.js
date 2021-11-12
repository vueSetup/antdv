/**
 * https://github.com/rollup/plugins
 */
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default (config) => {
    const { plugins = [], ...others } = config
    return {
        input: './src/index.ts',
        plugins: [typescript(), resolve(), commonjs()],
        ...others
    }
}

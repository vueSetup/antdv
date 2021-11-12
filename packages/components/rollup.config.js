import config from '../../rollup.config'

export default config({
    output: [
        {
            name: '@antdv/components',
            format: 'umd',
            file: 'dist/antdv.components.js'
        }
    ]
})

const base = process.env.BASE || '/'
const nav = require('./configs/nav')
const sidebar = require('./configs/sidebar')

module.exports = {
    title: 'Vue/Setup',
    description: '组件库',
    base: '/',
    repo: 'vuejs/vitepress',
    themeConfig: {
        nav,
        sidebar
    }
}
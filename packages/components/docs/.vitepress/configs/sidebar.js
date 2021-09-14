module.exports = {
    '/guide/': getGuideSidebar(),
    '/components/': getComponentsSidebar()
}

function getGuideSidebar() {
    return [
        {
            text: '教程',
            children: [
                {
                    text: '简介',
                    link: '/guide/intro'
                },
                {
                    text: '快速开始',
                    link: '/guide/getting-start'
                }
            ]
        }
    ]
}

function getComponentsSidebar() {
    return [
        {
            text: '组件',
            children: [
                {
                    text: 'Table - 按钮',
                    link: '/components/table'
                },
                {
                    text: 'Form - 表单',
                    link: '/components/form'
                }
            ]
        }
    ]
}


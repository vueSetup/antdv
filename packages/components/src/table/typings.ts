export * from '../typings'

export type TableSize = 'default' | 'small' | 'large' | 'middle'

/**
 * 菜单栏 options 配置
 * https://procomponents.ant.design/components/table#%E8%8F%9C%E5%8D%95%E6%A0%8F-options-%E9%85%8D%E7%BD%AE
 */
export type OptionConfig = {
    reload: boolean
    density?: boolean
    setting?: boolean
    fullScreen?: boolean,
    search?: boolean | { name: string }
}

/**
 * ActionRef 手动触发
 * https://procomponents.ant.design/components/table#actionref-%E6%89%8B%E5%8A%A8%E8%A7%A6%E5%8F%91
 */
export type ActionType = {
    reload: (resetPageIndex?: boolean) => void | Promise<void>
    fullscreen?: () => void
    tableSize?: (size?: TableSize) => string
    container?: HTMLElement
}

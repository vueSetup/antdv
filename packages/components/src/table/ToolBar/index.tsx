import './index.less'

import { defineComponent, PropType } from 'vue'
import { Space, Input } from 'ant-design-vue'
import ColumnSetting from './ColumnSetting'
import Density from './Density'
import FullScreen from './FullScreen'
import Reload from './Reload'
import { ActionType, OptionConfig, CustomRender, WithFalse } from '../typings'
import { omit } from 'lodash-es'

export const toolBarProps = {
    actionRef: Object as PropType<ActionType>,
    toolBarRender: [Boolean, Function, Object] as PropType<WithFalse<CustomRender>>,
    options: Object as PropType<WithFalse<OptionConfig>>,
    onSearch: Function as PropType<(params: Record<string, any>) => void>
}

const TooBar = defineComponent({
    props: toolBarProps,
    render() {
        const { actionRef, toolBarRender, options } = this.$props

        const prefixCls = 'ant-pro-table'
        const baseClassName = `${prefixCls}-list-toolbar`

        const buttons = {
            setting: (
                <div class={`${baseClassName}-setting-item`}>
                    <ColumnSetting />
                </div>
            ),
            density: (
                <div class={`${baseClassName}-setting-item`}>
                    <Density
                        tableSize={actionRef.tableSize()}
                        setTableSize={(size) => actionRef.tableSize(size)}
                    />
                </div>
            ),
            fullScreen: (
                <div
                    class={`${baseClassName}-setting-item`}
                    onClick={() => {
                        actionRef.fullscreen()
                    }}>
                    <FullScreen />
                </div>
            ),
            reload: (
                <div
                    class={`${baseClassName}-setting-item`}
                    onClick={() => {
                        actionRef.reload(false)
                    }}>
                    <Reload />
                </div>
            )
        }

        if (toolBarRender === false) return null

        const onSearch = (keyword: string) => {
            if (!options || !options.search) return
            const { name = 'keyword' } = options.search === true ? {} : options.search
            this.$props.onSearch({ [name]: keyword })
        }

        return (
            <div class={baseClassName}>
                <div class={`${baseClassName}-container`}>
                    <div class={`${baseClassName}-left`}>
                        {options && options.search && (
                            <Input.Search allowClear onSearch={onSearch} />
                        )}
                    </div>
                    <Space size={16} class={`${baseClassName}-right`}>
                        {toolBarRender && (
                            <Space size={12} align="center">
                                {toolBarRender}
                            </Space>
                        )}
                        {options && (
                            <Space
                                size={12}
                                align="center"
                                class={`${baseClassName}-setting-items`}>
                                {Object.keys(omit(options, 'search'))
                                    .filter((key) => options[key])
                                    .map((key) => buttons[key])}
                            </Space>
                        )}
                    </Space>
                </div>
            </div>
        )
    }
})

export default TooBar

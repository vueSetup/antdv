import './index.less'

import {
    defineComponent,
    shallowReactive,
    onMounted,
    toRefs,
    PropType,
    watchEffect,
    App,
    ExtractPropTypes
} from 'vue'
import { Card } from 'ant-design-vue'
import Toolbar, { toolBarProps } from './ToolBar'
import BasicTable, { basicTableProps } from './BasicTable'
import { TableSize, ActionType } from './typings'
import { getComponent } from '../utils/props'

// TODO :: defaultProps?
const defaultTableProps = {
    rowKey: {
        type: [String, Function] as PropType<string | (() => string)>,
        default: 'id'
    },
    size: {
        type: String as PropType<'default' | 'small' | 'large' | 'middle'>,
        default: 'middle'
    },
    pagination: {
        type: Object,
        default: () => {
            return {
                size: 'small',
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '30'],
                showTotal: (total: Number, range: Array<Number>) =>
                    `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
            }
        }
    }
}

export const tableProps = {
    ...basicTableProps,
    ...defaultTableProps,
    ...toolBarProps
}

export type TableProps = ExtractPropTypes<typeof tableProps>

const Table = defineComponent({
    name: 'AntdvTable',
    props: tableProps,
    setup(props, { slots, emit }) {
        const { params, actionRef, size } = props

        const state = shallowReactive<{
            container: HTMLElement | null
            tableSize: TableSize
            actionRef: ActionType
            params: Record<string, any>
        }>({
            container: null,
            tableSize: size,
            actionRef: actionRef || { reload: () => {} },
            params
        })

        watchEffect(() => {
            state.params = props.params
        })

        const onSearch = keyword => {
            // Object.assign(state.params, keyword)
            // Object.assign(state, { params: { ...state.params, ...keyword } })
            state.params = { ...state.params, ...keyword }
        }

        state.actionRef.fullscreen = () => {
            if (!document.fullscreenElement) {
                state.actionRef.container.requestFullscreen()
            } else {
                document.exitFullscreen()
            }
        }

        state.actionRef.tableSize = (size?: TableSize) => {
            if (size) {
                state.tableSize = size
            } else {
                size = state.tableSize
            }
            return size
        }

        onMounted(() => {
            state.actionRef.container = state.container
        })

        return { ...toRefs(state), onSearch }
    },
    render() {
        const { prefixCls = 'ant-pro', options, params, ...others } = this.$props

        const toolBarRender = getComponent(this, 'toolBarRender')

        const baseClassName = `${prefixCls}-table`

        return (
            <div class={baseClassName} ref="container">
                <Card
                    style={{ height: '100%' }}
                    bordered={false}
                    bodyStyle={
                        toolBarRender === false
                            ? { padding: 0 }
                            : { paddingTop: 0, paddingBottom: 0 }
                    }
                >
                    <Toolbar
                        toolBarRender={toolBarRender}
                        options={options}
                        actionRef={this.actionRef}
                        onSearch={this.onSearch}
                    />
                    <BasicTable
                        {...others}
                        v-slots={this.$slots}
                        actionRef={this.actionRef}
                        params={this.params}
                        size={this.tableSize}
                    />
                </Card>
            </div>
        )
    }
})

Table.install = function(app: App) {
    app.component(Table.name, Table)
    return app
}

export default Table

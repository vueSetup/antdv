import './index.less'

import {
    defineComponent,
    shallowRef,
    shallowReactive,
    watchEffect,
    toRef,
    PropType,
    ExtractPropTypes
} from 'vue'
import { Card } from 'ant-design-vue'
import Toolbar, { toolBarProps } from './ToolBar'
import BasicTable, { basicTableProps } from './BasicTable'
import { ColumnProps as AColumnProps } from 'ant-design-vue/es/table/interface'
import { useBasicColumns } from './useColumns'
import { TableSize, ActionType } from './typings'
// import { getComponent } from '../utils/props'
import { omit } from 'lodash'

export type ColumnProps = AColumnProps & {
    valueEnum?: Record<
        number | string,
        { text: string; status?: 'default' | 'error' | 'success' | 'warning' | 'processing' }
    >
}

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
    ...toolBarProps,
    columns: Array as PropType<ColumnProps[]>
}

export type TableProps = ExtractPropTypes<typeof tableProps>

const Table = defineComponent({
    name: 'AntdvTable',
    props: tableProps,
    setup(props, { slots, emit }) {
        const { params, actionRef, size, options } = props

        const container = shallowRef<HTMLElement | null>(null)

        // @ts-ignore
        const columns = useBasicColumns(toRef(props, 'columns'))

        const state = shallowReactive<{
            tableSize: TableSize
            params: Record<string, any>
        }>({
            tableSize: size,
            params
        })

        watchEffect(() => {
            state.params = props.params
        })

        // TODO:: refactor?
        actionRef.search = (keyword: string) => {
            if (options && options.search) {
                const search = {}
                if (options.search === true) {
                    search['keyword'] = keyword
                } else {
                    search[options.search.name] = keyword
                }
                if (keyword) {
                    state.params = { ...state.params, ...search }
                } else {
                    if (options.search === true) {
                        state.params = omit(state.params, 'keyword')
                    } else {
                        state.params = omit(state.params, options.search.name)
                    }
                }
            }
        }

        actionRef.tableSize = (size?: TableSize) => {
            if (size) {
                state.tableSize = size
            } else {
                size = state.tableSize
            }
            return size
        }

        actionRef.fullscreen = () => {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                container.value?.requestFullscreen()
            }
        }

        const prefixCls = 'ant-pro'
        const baseClassName = `${prefixCls}-table`

        // TODO:: getComponent in setup
        const toolBarRender = props.toolBarRender || slots.toolBarRender || false
        // const toolBarRender = getComponent(this, 'toolBarRender')

        return () => (
            <div class={baseClassName} ref={container}>
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
                        actionRef={actionRef}
                    />
                    <BasicTable
                        {...props}
                        columns={columns.value}
                        actionRef={actionRef}
                        params={state.params}
                        size={state.tableSize}
                        v-slots={slots}
                    />
                </Card>
            </div>
        )
    }
})

export default Table

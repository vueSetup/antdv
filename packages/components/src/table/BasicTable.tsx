import {
    defineComponent,
    reactive,
    watch,
    toRefs,
    ExtractPropTypes,
    PropType,
    watchEffect,
    toRef,
    App
} from 'vue'
import { Table } from 'ant-design-vue'
import { tableProps, ColumnProps } from 'ant-design-vue/es/table/interface'
import { useFetchPagedData, RequestParams, ResponseData } from '../composables'
import { ActionType } from './typings'
import { useBasicColumns } from './useColumns'

export type BasicColumnProps = ColumnProps & {
    valueEnum?: Record<
        number | string,
        { text: string; status?: 'default' | 'error' | 'success' | 'warning' | 'processing' }
    >
}

export const basicTableProps = {
    ...tableProps,
    columns: Array as PropType<BasicColumnProps[]>,
    request: Function as PropType<
        (
            params: { current: number; pageSize: number; [key: string]: any },
            sorter?: Record<string, string>,
            filters?: Record<string, string[]>
        ) => any | Promise<any>
    >,
    postData: Function as PropType<(data: any) => ResponseData<any> | Promise<ResponseData<any>>>,
    params: Object as PropType<Record<string, any>>,
    actionRef: Object as PropType<ActionType>
}

export type BasicTableProps = ExtractPropTypes<typeof basicTableProps>

const BasicTable = defineComponent({
    props: basicTableProps,
    setup(props, { emit }) {
        const { request, postData, params, actionRef, pagination } = props

        // @ts-ignore
        const columns = useBasicColumns(toRef(props, 'columns'))

        // TODO :: if pagination === false then current = 1 & pageSize = 10 ?
        const current =
            typeof pagination !== 'boolean'
                ? pagination?.defaultCurrent || pagination?.current || 1
                : 1

        const pageSize =
            typeof pagination !== 'boolean'
                ? pagination?.defaultPageSize || pagination?.pageSize || 10
                : 10

        const options = reactive<RequestParams>({
            current,
            pageSize,
            params,
            sorter: {},
            filters: {}
        })

        const { state, reload } = useFetchPagedData(request, postData, options)

        actionRef.reload = reload

        watch(
            () => props.params,
            (params, prevParams) => {
                options.params = params
            },
            { deep: true }
        )

        const chagePageInfo = (
            pagination: any,
            filters: Record<string, string[]>,
            sorter: Record<string, string>
        ) => {
            options.current = pagination.current
            options.pageSize = pagination.pageSize
            options.sorter = sorter
            options.filters = filters
            emit('change', pagination, filters, sorter)
        }

        return { ...toRefs(state), columns, chagePageInfo }
    },
    render() {
        const { pagination, ...others } = this.$props
        return (
            <Table
                {...others}
                columns={this.columns}
                loading={this.loading}
                dataSource={this.data}
                pagination={{
                    ...(pagination as ExtractPropTypes<typeof tableProps['pagination']>),
                    current: this.current,
                    pageSize: this.pageSize,
                    total: this.total
                }}
                onChange={this.chagePageInfo}
                v-slots={this.$slots}
            />
        )
    }
})

BasicTable.install = (app: App) => {
    app.component(BasicTable.name, BasicTable)
    return app
}

export default BasicTable

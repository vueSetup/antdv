import { defineComponent, reactive, watch, toRefs, ExtractPropTypes, PropType, toRef } from 'vue'
import Table from 'ant-design-vue/es/table'
import { tableProps } from 'ant-design-vue/es/table/interface'
import { useFetchPagedData, RequestParams, ResponseData } from '../composables'
import { ActionType } from './typings'

export const basicTableProps = {
    ...tableProps,
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
    setup(props, { slots, emit }) {
        const { request, postData, params, actionRef, pagination } = props

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
            options.filters = filters
            options.sorter = sorter
            emit('change', pagination, filters, sorter)
        }

        return () => (
            <Table
                {...props}
                loading={state.loading}
                dataSource={state.data}
                pagination={{
                    ...(pagination as ExtractPropTypes<typeof tableProps['pagination']>),
                    current: state.current,
                    pageSize: state.pageSize,
                    total: state.total
                }}
                onChange={chagePageInfo}
                v-slots={slots}
            />
        )
    }
})

export default BasicTable

import { isReactive, reactive, watch, onBeforeMount } from 'vue'
import { cloneDeep, isEqual, isEmpty, omit } from 'lodash-es'
import { omitNil } from "../utils"

// InputRefs
export type RequestParams = {
    current: number
    pageSize: number
    params?: Record<string, any>
    sorter?: Record<string, string>
    filters?: Record<string, string[]>
}

// OutputRefs
export interface ResponseData<T> {
    data: T[],
    total: number
}

// ContextRefs
export interface Context<T> extends RequestParams, ResponseData<T> {
    loading: boolean
}

const defaultContext: Context<any> = {
    current: 1,
    pageSize: 10,
    loading: false,
    data: [],
    total: 0
}

export const useFetchPagedData = <T extends Record<string, any>>(
    getData: (
        params: { current: number; pageSize: number;[key: string]: any },
        sorter?: Record<string, string>,
        filters?: Record<string, string[]>
    ) => Promise<any>,
    postData?: (data: any) => ResponseData<any> | Promise<ResponseData<T>>,
    options?: RequestParams
) => {
    if (!isReactive(options))
        console.warn(`The 'options' parameter of useFetchPagedData should be reactive`)

    const state = reactive<Context<T>>({
        ...defaultContext,
        ...options
    })

    const fetchData = async () => {
        const { current, pageSize, params, sorter, filters } = state
        try {
            state.loading = true
            const json = await getData({ current, pageSize, ...params }, sorter, filters)
            const { data, total } = await postData?.(json) || json as ResponseData<T>
            if (total > 0 && current > Math.ceil(total / pageSize)) {
                state.current = Math.ceil(total / pageSize)
                fetchData()
            } else {
                Object.assign(state, { data, total })
            }
        } catch (e) {
            throw new Error(e)
        } finally {
            state.loading = false
        }
    }

    onBeforeMount(() => {
        fetchData()
    })

    // A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.
    // Watching a reactive object or array will always return a reference to the current value of that object for both the current and previous value of the state.
    // To fully watch deeply nested objects and arrays, a deep copy of values may be required.
    // https://v3.vuejs.org/guide/reactivity-computed-watchers.html#watching-reactive-objects
    watch(
        () => cloneDeep(options),
        (options, prevOptions) => {
            if (!isEqual(omitNil(options), omitNil(prevOptions))) {
                Object.assign(state, options)
                // When params, sorter, filters changed, the page index should be reset to 1.
                if (!isEqual(omit(omitNil(options), 'current'), omit(omitNil(prevOptions), 'current'))) {
                    state.current = 1
                }
                fetchData()
            }
        },
        { deep: true }
    )

    const reload = async (resetPageIndex: boolean) => {
        if (resetPageIndex) {
            state.current = 1
        }
        await fetchData()
    }

    return { state, reload }
}
import { defineComponent, onMounted, reactive, shallowRef } from 'vue'
import { Table } from 'ant-design-vue'
import { DragOutlined } from '@ant-design/icons-vue'
import 'ant-design-vue/dist/antd.less'

const columns = [
    {
        key: 'index',
        title: 'sort',
        customRender: () => <DragOutlined />
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age'
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address'
    }
]

const dataSource = [
    {
        key: '1',
        name: 'Mike 1',
        age: 12,
        address: '101 Downing Street'
    },
    {
        key: '2',
        name: 'John 2',
        age: 22,
        address: '102 Downing Street'
    },
    {
        key: '3',
        name: 'Mike 3',
        age: 32,
        address: '103 Downing Street'
    },
    {
        key: '4',
        name: 'John 4',
        age: 42,
        address: '104 Downing Street'
    }
]

export default defineComponent({
    setup() {
        const tableRef = shallowRef<HTMLElement | null>(null)

        const state = reactive<{
            dataSource: Record<string, any>[]
        }>({
            dataSource
        })

        onMounted(() => {
            if (tableRef.value) {
                // @ts-ignore
                const container = tableRef.value.$el.getElementsByClassName(
                    'ant-table-tbody'
                )[0] as HTMLElement
                container.ondragstart = (e: DragEvent) => {
                    const dragEle = e.target as HTMLElement

                    e.dataTransfer!.effectAllowed = 'move'

                    container.ondragover = (e: DragEvent) => {
                        e.preventDefault()

                        e.dataTransfer!.dropEffect = 'move'

                        // @ts-ignore
                        // var target = e.target as HTMLElement
                        var target = e.target.parentElement as HTMLElement

                        if (target && target !== dragEle && target.nodeName == 'TR') {
                            const nextEle =
                                container.children[0] == target ? target : target.nextElementSibling
                            container.insertBefore(dragEle, nextEle)
                        }
                    }
                    container.ondragend = (e: DragEvent) => {
                        e.preventDefault()

                        const sorting = Array.from(container.children).map((itemEle) => {
                            // @ts-ignore
                            return itemEle.dataset['rowKey'] as string
                        })
                        const newDataSource: Record<string, any>[] = []
                        sorting.map((key) => {
                            const item = state.dataSource.find((item) => item['key'] === key)
                            newDataSource.push(item!)
                        })
                        state.dataSource = newDataSource
                    }
                }
            }
        })

        return () => (
            <>
                {JSON.stringify(state.dataSource)}
                <Table
                    ref={tableRef}
                    columns={columns}
                    dataSource={state.dataSource}
                    customRow={() => ({ draggable: true })}
                    pagination={false}
                />
            </>
        )
    }
})

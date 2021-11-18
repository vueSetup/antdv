import { computed, defineComponent, watch, reactive, shallowRef } from 'vue'
import { Table, Card, Row, Tooltip, Popover, Checkbox } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { ColumnProps } from 'ant-design-vue/lib/table'
import 'ant-design-vue/dist/antd.less'

const columns: ColumnProps[] = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
    },
    {
        title: '地址',
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
        const state = reactive<{
            isCheckedAll: boolean
            indeterminate: boolean
            columnsItems: Record<string, any>[]
            showColumns: Record<string, any>[]
        }>({
            isCheckedAll: true,
            indeterminate: false,
            columnsItems: columns.map(column => ({ ...column, checked: true })),
            showColumns: []
        })

        watch(
            () => state.columnsItems,
            (columnsItems, prevColumnItems) => {
                state.showColumns = columnsItems.filter(item => item.checked === true)
            },
            { deep: true, immediate: true }
        )

        watch(
            () => state.showColumns,
            (showColumns) => {
                state.indeterminate = !!showColumns.length && showColumns.length < state.columnsItems.length;
                state.isCheckedAll = showColumns.length === state.columnsItems.length;
            },
            { deep: true }
        )

        const handleColumnAllClick = (e: Event) => {
            const checked = (e.target as HTMLInputElement).checked;
            state.columnsItems = state.columnsItems.map(item => ({ ...item, checked: checked }))
            state.isCheckedAll = checked
        }

        return () => (
            <Card
                title={<Row justify='space-between'>
                    <div></div>
                    <div>
                        <Popover
                            visible={true}
                            trigger="click"
                            placement="bottomRight"
                            arrowPointAtCenter={true}
                            title={<Row justify='space-between'>
                                <div>
                                    <Checkbox
                                        v-model={[state.isCheckedAll, 'checked']}
                                        indeterminate={state.indeterminate}
                                        onChange={(e) => handleColumnAllClick(e)}
                                    >
                                        列展示
                                    </Checkbox>
                                </div>
                                <div>重置</div>
                            </Row>}
                            content={
                                state.columnsItems.map(column => {
                                    return (
                                        <div>
                                            <Checkbox v-model={[column.checked, 'checked']}>
                                                {column.title}
                                            </Checkbox>
                                        </div>
                                    )
                                })
                            }
                        >
                            <Tooltip title='列设置'>
                                <SettingOutlined />
                            </Tooltip>
                        </Popover>
                    </div>
                </Row>}
            >
                <Table columns={state.showColumns} dataSource={dataSource} pagination={false} />
            </Card>
        )
    }
})

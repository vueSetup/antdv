import { defineComponent, onMounted, reactive, shallowRef } from 'vue'
import { Table } from 'ant-design-vue'

import 'ant-design-vue/dist/antd.less'

const columns = [
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
        return () => (
            <>
                <Table columns={columns} dataSource={dataSource} pagination={false} />
            </>
        )
    }
})

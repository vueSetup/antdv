import { defineComponent, reactive, watch, toRefs, PropType } from 'vue'
import { Tooltip, Dropdown, Menu } from 'ant-design-vue'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'
import { TableSize } from '../typings'

const { Item } = Menu

const densityProps = {
    tableSize: String,
    setTableSize: Function as PropType<(size?: TableSize) => string>
}

const Density = defineComponent({
    props: densityProps,
    setup(props, { emit }) {
        const { tableSize, setTableSize } = props
        
        const state = reactive({
            selectedKeys: [tableSize]
        })

        watch(
            () => state.selectedKeys,
            (selectedKeys) => {
                setTableSize(selectedKeys[0] as TableSize)
            }
        )

        return { ...toRefs(state) }
    },
    render() {
        return (
            <Tooltip title="表格密度">
                <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                        <Menu
                            selectable
                            style={{ width: '80px' }}
                            v-model={[this.selectedKeys, 'selectedKeys']}>
                            <Item key="default">默认</Item>
                            <Item key="middle">中等</Item>
                            <Item key="small">紧凑</Item>
                        </Menu>
                    }>
                    <ColumnHeightOutlined />
                </Dropdown>
            </Tooltip>
        )
    }
})

export default Density

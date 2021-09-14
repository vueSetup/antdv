import './index.less'

import { defineComponent, PropType } from 'vue'
import { Tooltip, Popover, Checkbox, Tree } from 'ant-design-vue'
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import { SettingOutlined } from '@ant-design/icons-vue'
import { BasicColumnProps } from '../../BasicTable'

const ColumnSettingProps = {
    columns: Array as PropType<BasicColumnProps[]>
}

const ColumnsTree = (columns: BasicColumnProps[]) => {
    const treeData = columns.map(
        (column) =>
            ({
                key: column.key || column.dataIndex,
                title: column.title
            } as TreeDataItem)
    )
    return <Tree treeData={treeData} />
}

const ColumnSetting = defineComponent({
    props: ColumnSettingProps,
    setup(props) {
        const prefixCls = 'ant-pro'
        const className = `${prefixCls}-table-column-setting`

        return () => (
            <Popover
                arrowPointAtCenter
                title={
                    <div class={`${className}-title`}>
                        <Checkbox>列展示</Checkbox>
                        <a>重置</a>
                    </div>
                }
                overlayClassName={`${className}-overlay`}
                trigger="click"
                placement="bottomRight"
                // content={ColumnsTree(props.columns)}
            >
                <Tooltip title="列设置">
                    <SettingOutlined />
                </Tooltip>
            </Popover>
        )
    }
})

export default ColumnSetting

import { defineComponent, reactive, watch, toRef, toRefs, PropType, ExtractPropTypes } from 'vue'
import { Button } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import Table from 'ant-design-vue/es/table'
import { tableProps, ColumnProps } from 'ant-design-vue/es/table/interface'
// TODO :: BasicTable
// import BasicTable, { BasicTableProps, BasicColumnProps } from './BasicTable'
import Form, { useForm } from 'ant-design-vue/es/form'
import { ValidationRule } from 'ant-design-vue/es/form/Form'
import { useEditableColumns } from './useColumns'
import { cloneDeep } from 'lodash-es'

export type EditableColumnProps = ColumnProps & {
    rules?: ValidationRule[]
}

export const editableTableProps = {
    ...tableProps,
    columns: Array as PropType<EditableColumnProps[]>,
    value: {
        type: Array as PropType<Record<string, any>[]>,
        default: []
    }
}

export type EditableTableProps = ExtractPropTypes<typeof editableTableProps>

const EditableTable = defineComponent({
    props: editableTableProps,
    setup(props, { emit, slots }) {
        const state = reactive({
            data: cloneDeep(props.value),
            rules: {}
        })

        // props.value.forEach((record, index) => {
        //     props.columns.forEach((column) => {
        //         if (column.rules) {
        //             state.rules[`${index}.${column.dataIndex}`] = column.rules
        //         }
        //     })
        // })

        const { resetFields, validate, validateInfos } = useForm(state.data, state.rules)

        // @ts-ignore
        const columnsRef = useEditableColumns(toRef(props, 'columns'), validateInfos)

        columnsRef.value.push({
            title: '操作',
            customRender: ({ text, record, index }) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            state.data.splice(index, 1)
                        }}>
                        删除
                    </Button>
                )
            }
        })

        watch(
            () => props.value,
            (value) => {
                if (value) {
                    value.forEach((record, index) => {
                        props.columns.forEach((column) => {
                            if (column.rules) {
                                state.rules[`${index}.${column.dataIndex}`] = column.rules
                            }
                        })
                    })
                }
                state.data = value
            },
            {
                deep: true
            }
        )

        watch(
            () => state.data,
            (data) => {
                emit('update:value', data)
            },
            {
                deep: true
            }
        )

        const handleAdd = () => {
            const newRecord = {}
            props.columns.forEach((column) => {
                if (column.dataIndex) {
                    newRecord[column.dataIndex] = undefined
                }
            })
            state.data.push(newRecord)
        }

        return { ...toRefs(state), columnsRef, handleAdd }
    },
    render() {
        const { size = 'small', columns } = this.$props

        return (
            <Form>
                <Table
                    size={size}
                    columns={this.columnsRef}
                    dataSource={this.data}
                    v-slots={this.$slots}
                    pagination={false}
                />
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={this.handleAdd}
                    style={{
                        display: 'block',
                        margin: '10px 0',
                        width: '100%'
                    }}>
                    添加一行
                </Button>
            </Form>
        )
    }
})

export default EditableTable

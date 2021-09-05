import { ref, watch, useSlots, Ref } from 'vue'
import { Badge, FormItem, Input } from 'ant-design-vue'
import { ColumnProps } from 'ant-design-vue/es/table/interface'
import { BasicColumnProps } from './BasicTable'
import { EditableColumnProps } from './Editable'
import { omit } from 'lodash-es'

export const useBasicColumns = (propsColumnsRef: Ref<BasicColumnProps[]>): Ref<ColumnProps[]> => {
    const columnsRef = ref<ColumnProps[]>([])

    watch(
        propsColumnsRef,
        (propsColumns) => {
            columnsRef.value = propsColumns.map((propsColumn: BasicColumnProps) => {
                const column: ColumnProps = { ...omit(propsColumn, 'valueEnum') }
                if (propsColumn.valueEnum) {
                    column.customRender = ({ text }) =>
                        propsColumn.valueEnum[text]?.status ? (
                            <Badge
                                status={propsColumn.valueEnum[text]?.status}
                                text={propsColumn.valueEnum[text]?.text}
                            />
                        ) : (
                            propsColumn.valueEnum[text]?.text
                        )
                }
                return column
            })
        },
        { immediate: true, deep: true }
    )

    // @ts-ignore
    return columnsRef
}

export const useEditableColumns = (
    propsColumnsRef: Ref<EditableColumnProps[]>,
    validateInfos: Record<string, any>
): Ref<ColumnProps[]> => {
    const columnsRef = ref<ColumnProps[]>([])

    const slots = useSlots()

    watch(
        propsColumnsRef,
        (propsColumns) => {
            columnsRef.value = propsColumns.map((propsColumn) => {
                const column: ColumnProps = { ...omit(propsColumn, 'customRender', 'rules') }

                column.customRender = ({ text, record, index }) => (
                    <FormItem {...validateInfos[`${index}.${column.dataIndex}`]}>
                        {propsColumn.customRender?.({ text, record, index }) ||
                            slots[propsColumn.slots?.customRender]?.({ text, record, index }) || (
                                <Input v-model={[record[column.dataIndex], 'value']} allowClear />
                            )}
                    </FormItem>
                )

                return column
            })
        },
        { immediate: true, deep: true }
    )

    // @ts-ignore
    return columnsRef
}

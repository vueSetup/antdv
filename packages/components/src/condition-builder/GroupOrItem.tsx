import { defineComponent, PropType } from 'vue'
import { Config } from './config'
import { Fields, ConditionGroupValue, Funcs, ConditionValue } from './types'
import ConditionGroup from './Group'
import ConditionItem from './Item'
import { CloseOutlined } from '@ant-design/icons-vue'
import { DragOutlined } from '../icons'

// export interface CBGroupOrItemProps {
//   config: Config;
//   value?: ConditionGroupValue;
//   fields: Fields;
//   funcs?: Funcs;
//   index: number;
//   data?: any;
//   draggable?: boolean;
//   onChange: (value: ConditionGroupValue, index: number) => void;
//   removeable?: boolean;
//   onDragStart?: (e: React.MouseEvent) => void;
//   onRemove?: (index: number) => void;
// }

const ConditionGroupOrItemProps = {
    config: Object as PropType<Config>,
    fields: Array as PropType<Fields>,
    funcs: Array as PropType<Funcs>,
    index: Number,
    data: Object,
    draggable: Boolean,
    removeable: Boolean,
    disabled: Boolean,
    value: Object as PropType<ConditionGroupValue>,
    onChange: Function as PropType<(value: ConditionGroupValue, index: number) => void>,
    onDragStart: Function as PropType<(e: DragEvent) => void>,
    onRemove: Function as PropType<(index: number) => void>,
    fieldClassName: String
}

export const ConditionGroupOrItem = defineComponent({
    props: ConditionGroupOrItemProps,
    setup(props) {
        const handleItemChange = (value: any) => {
            props.onChange(value, props.index)
        }

        const handleItemRemove = () => {
            props.onRemove?.(props.index)
        }

        return {
            handleItemChange,
            handleItemRemove
        }
    },
    render() {
        const {
            fieldClassName,
            value,
            config,
            fields,
            funcs,
            draggable,
            data,
            disabled,
            onDragStart
        } = this.$props

        return (
            <div class="CBGroupOrItem" data-id={value?.id}>
                <div class="CBGroupOrItem-body">
                    {draggable ? (
                        <a class="CBGroupOrItem-dragbar" draggable onDragstart={onDragStart}>
                            <DragOutlined />
                        </a>
                    ) : null}

                    {value?.conjunction ? (
                        <ConditionGroup
                            disabled={disabled}
                            onDragStart={onDragStart}
                            config={config}
                            fields={fields}
                            value={value as ConditionGroupValue}
                            onChange={this.handleItemChange}
                            fieldClassName={fieldClassName}
                            funcs={funcs}
                            removeable
                            onRemove={this.handleItemRemove}
                            data={data}
                        />
                    ) : (
                        <>
                            <ConditionItem
                                disabled={disabled}
                                config={config}
                                fields={fields}
                                value={value as ConditionValue}
                                onChange={this.handleItemChange}
                                fieldClassName={fieldClassName}
                                funcs={funcs}
                                data={data}
                            />
                            <a class="CBDelete'" onClick={this.handleItemRemove}>
                                <CloseOutlined />
                            </a>
                        </>
                    )}
                </div>
            </div>
        )
    }
})

export default ConditionGroupOrItem

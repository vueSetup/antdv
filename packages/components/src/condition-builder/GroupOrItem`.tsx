import { FunctionalComponent } from 'vue'
import { Config } from './config'
import { Fields, ConditionGroupValue, Funcs, ConditionValue } from './types'
import ConditionGroup from './Group'
import ConditionItem from './Item'
import { CloseOutlined } from '@ant-design/icons-vue'
import { DragOutlined } from '../icons'

export interface ConditionGroupOrItemProps {
    config: Config
    value?: ConditionGroupValue
    fields: Fields
    funcs?: Funcs
    index: number
    data?: any
    draggable?: boolean
    disabled?: boolean
    searchable?: boolean
    onChange: (value: ConditionGroupValue, index: number) => void
    removeable?: boolean
    onDragStart?: (e: MouseEvent) => void
    onRemove?: (index: number) => void
    fieldClassName?: string
}

const ConditionGroupOrItem: FunctionalComponent<ConditionGroupOrItemProps> = (props) => {
    const handleItemChange = (value: any) => {
        props.onChange(value, props.index)
    }

    const handleItemRemove = () => {
        props.onRemove?.(props.index)
    }

    const {
        fieldClassName,
        value,
        config,
        fields,
        funcs,
        draggable,
        data,
        disabled,
        searchable,
        onDragStart
    } = props

    return (
        <div class="CBGroupOrItem" data-id={value?.id}>
            <div class="CBGroupOrItem-body">
                {draggable ? (
                    <a draggable onDragstart={onDragStart} class="CBGroupOrItem-dragbar">
                        <DragOutlined />
                    </a>
                ) : null}

                {value?.conjunction ? (
                    <ConditionGroup
                        disabled={disabled}
                        searchable={searchable}
                        onDragStart={onDragStart}
                        config={config}
                        fields={fields}
                        value={value as ConditionGroupValue}
                        onChange={handleItemChange}
                        fieldClassName={fieldClassName}
                        funcs={funcs}
                        removeable
                        onRemove={handleItemRemove}
                        data={data}
                    />
                ) : (
                    <>
                        <ConditionItem
                            disabled={disabled}
                            searchable={searchable}
                            config={config}
                            fields={fields}
                            value={value as ConditionValue}
                            onChange={handleItemChange}
                            fieldClassName={fieldClassName}
                            funcs={funcs}
                            data={data}
                        />
                        <a class="CBDelete" onClick={handleItemRemove}>
                            <CloseOutlined />
                        </a>
                    </>
                )}
            </div>
        </div>
    )
}

export default ConditionGroupOrItem

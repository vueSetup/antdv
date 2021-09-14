import { defineComponent, PropType } from 'vue'
import { Fields, ConditionGroupValue, Funcs } from './types'
import { Config } from './config'
import GroupOrItem from './GroupOrItem'
import { Button } from 'ant-design-vue'
import { guid } from './utils/helper'
import { PlusOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue'

const { Group: ButtonGroup } = Button

// export interface ConditionGroupProps {
//   config: Config;
//   value?: ConditionGroupValue;
//   fields: Fields;
//   funcs?: Funcs;
//   showNot?: boolean;
//   data?: any;
//   onChange: (value: ConditionGroupValue) => void;
//   removeable?: boolean;
//   onRemove?: (e: React.MouseEvent) => void;
//   onDragStart?: (e: React.MouseEvent) => void;
// }

const ConditionGroupProps = {
    config: Object as PropType<Config>,
    fields: Array as PropType<Fields>,
    funcs: Array as PropType<Funcs>,
    showNot: Boolean,
    data: Object,
    disabled: Boolean,
    removeable: Boolean,
    onRemove: Function as PropType<(e: MouseEvent) => void>,
    value: Object as PropType<ConditionGroupValue>,
    onChange: Function as PropType<(value: ConditionGroupValue) => void>,
    onDragStart: Function as PropType<(e: DragEvent) => void>,
    fieldClassName: String
}

export const ConditionGroup = defineComponent({
    props: ConditionGroupProps,
    setup(props) {
        const getValue = () => {
            return {
                id: guid(),
                conjunction: 'and' as 'and',
                ...props.value
            } as ConditionGroupValue
        }

        const handleNotClick = () => {
            const onChange = props.onChange
            let value = getValue()
            value.not = !value.not

            onChange(value)
        }

        const handleConjunctionClick = () => {
            const onChange = props.onChange
            let value = getValue()
            value.conjunction = value.conjunction === 'and' ? 'or' : 'and'
            onChange(value)
        }

        const handleAdd = () => {
            const onChange = props.onChange
            let value = getValue()

            value.children = Array.isArray(value.children) ? value.children.concat() : []

            value.children.push({
                id: guid()
            })
            onChange(value)
        }

        const handleAddGroup = () => {
            const onChange = props.onChange
            let value = getValue()

            value.children = Array.isArray(value.children) ? value.children.concat() : []

            value.children.push({
                id: guid(),
                conjunction: 'and',
                children: [
                    {
                        id: guid()
                    }
                ]
            })
            onChange(value)
        }

        const handleItemChange = (item: any, index: number) => {
            const onChange = props.onChange
            let value = getValue()

            value.children = Array.isArray(value.children) ? value.children.concat() : []

            value.children.splice(index!, 1, item)
            onChange(value)
        }

        const handleItemRemove = (index: number) => {
            const onChange = props.onChange
            let value = getValue()

            value.children = Array.isArray(value.children) ? value.children.concat() : []

            value.children.splice(index, 1)
            onChange(value)
        }

        return {
            handleNotClick,
            handleConjunctionClick,
            handleAdd,
            handleAddGroup,
            handleItemChange,
            handleItemRemove
        }
    },
    render() {
        const {
            fieldClassName,
            value,
            data,
            fields,
            funcs,
            config,
            removeable,
            onRemove,
            onDragStart,
            showNot,
            disabled
        } = this.$props

        return (
            <div class="CBGroup" data-group-id={value?.id}>
                <div class="CBGroup-toolbar">
                    <div class="CBGroup-toolbarCondition">
                        {showNot ? (
                            <Button
                                onClick={this.handleNotClick}
                                size="small"
                                type={value?.not ? 'primary' : 'dashed'}
                                disabled={disabled}
                                // active={value?.not}
                                // level={value?.not ? 'info' : 'default'}
                            >
                                非
                            </Button>
                        ) : null}
                        <ButtonGroup>
                            <Button
                                size="small"
                                onClick={this.handleConjunctionClick}
                                type={value?.conjunction !== 'or' ? 'primary' : 'dashed'}
                                disabled={disabled}
                                // active={value?.conjunction !== 'or'}
                                // level={value?.conjunction !== 'or' ? 'info' : 'default'}
                            >
                                并且
                            </Button>
                            <Button
                                size="small"
                                onClick={this.handleConjunctionClick}
                                type={value?.conjunction === 'or' ? 'primary' : 'dashed'}
                                disabled={disabled}
                                // active={value?.conjunction === 'or'}
                                // level={value?.conjunction === 'or' ? 'info' : 'default'}
                            >
                                或者
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div class="CBGroup-toolbarConditionAdd">
                        <ButtonGroup>
                            <Button onClick={this.handleAdd} size="small" disabled={disabled}>
                                <PlusOutlined />
                                添加条件
                            </Button>
                            <Button onClick={this.handleAddGroup} size="small" disabled={disabled}>
                                <PlusCircleOutlined />
                                添加条件组
                            </Button>
                        </ButtonGroup>
                    </div>
                    {removeable ? (
                        <a class="CBDelete" onClick={onRemove}>
                            <CloseOutlined />
                        </a>
                    ) : null}
                </div>
                <div class="CBGroup-body">
                    {Array.isArray(value?.children) && value!.children.length ? (
                        value!.children.map((item, index) => (
                            <GroupOrItem
                                draggable={value!.children!.length > 1}
                                onDragStart={onDragStart}
                                config={config}
                                key={item.id}
                                fields={fields}
                                fieldClassName={fieldClassName}
                                value={item as ConditionGroupValue}
                                index={index}
                                onChange={this.handleItemChange}
                                funcs={funcs}
                                onRemove={this.handleItemRemove}
                                data={data}
                                disabled={disabled}
                            />
                        ))
                    ) : (
                        <div class="CBGroup-placeholder">空</div>
                    )}
                </div>
            </div>
        )
    }
})

export default ConditionGroup

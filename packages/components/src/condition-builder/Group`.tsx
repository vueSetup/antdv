import { FunctionalComponent } from 'vue'
import { Fields, ConditionGroupValue, Funcs } from './types'
import { Config } from './config'
import GroupOrItem from './GroupOrItem'
import { Button } from 'ant-design-vue'
import { PlusOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { guid } from './utils/helper'

const { Group: ButtonGroup } = Button

export interface ConditionGroupProps {
    config: Config
    value?: ConditionGroupValue
    fields: Fields
    funcs?: Funcs
    showNot?: boolean
    data?: any
    disabled?: boolean
    searchable?: boolean
    onChange: (value: ConditionGroupValue) => void
    removeable?: boolean
    onRemove?: (e: MouseEvent) => void
    onDragStart?: (e: MouseEvent) => void
    fieldClassName?: string
}

const ConditionGroup: FunctionalComponent<ConditionGroupProps> = (props) => {
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
        disabled,
        searchable
    } = props

    return (
        <div class="CBGroup" data-group-id={value?.id}>
            <div class="CBGroup-toolbar">
                <div class="CBGroup-toolbarCondition">
                    {showNot ? (
                        <Button
                            onClick={handleNotClick}
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
                            onClick={handleConjunctionClick}
                            type={value?.conjunction !== 'or' ? 'primary' : 'dashed'}
                            disabled={disabled}
                            // active={value?.conjunction !== 'or'}
                            // level={value?.conjunction !== 'or' ? 'info' : 'default'}
                        >
                            并且
                        </Button>
                        <Button
                            size="small"
                            onClick={handleConjunctionClick}
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
                    <Button.Group>
                        <Button onClick={handleAdd} size="small" disabled={disabled}>
                            <PlusOutlined />
                            添加条件
                        </Button>
                        <Button onClick={handleAddGroup} size="small" disabled={disabled}>
                            <PlusCircleOutlined />
                            添加条件组
                        </Button>
                    </Button.Group>
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
                            onChange={handleItemChange}
                            funcs={funcs}
                            onRemove={handleItemRemove}
                            data={data}
                            disabled={disabled}
                            searchable={searchable}
                        />
                    ))
                ) : (
                    <div class="CBGroup-placeholder">空</div>
                )}
            </div>
        </div>
    )
}

export default ConditionGroup

import { FunctionalComponent } from 'vue'
import {
    ExpressionComplex,
    Field,
    Funcs,
    Func,
    ExpressionFunc,
    Type,
    FieldSimple,
    FieldGroup,
    OperatorType
} from './types'
import { Config } from './config'
import ConditionField from './Field'
import Value from './Value'
import InputSwitch from './InputSwitch'
import ConditionFunc from './Func'
import Formula from './Formula'
import { findTree, filterTree } from './utils/helper'

/**
 * 支持4中表达式设置方式
 *
 * 1. 直接就是值，由用户直接填写。
 * 2. 选择字段，让用户选一个字段。
 * 3. 选择一个函数，然后会参数里面的输入情况是个递归。
 * 4. 粗暴点，函数让用户自己书写。
 */

export interface ExpressionProps {
    value: ExpressionComplex
    data?: any
    index?: number
    onChange: (value: ExpressionComplex, index?: number) => void
    valueField?: FieldSimple
    fields?: Field[]
    funcs?: Funcs
    allowedTypes?: Array<'value' | 'field' | 'func' | 'formula'>
    op?: OperatorType
    config: Config
    disabled?: boolean
    searchable?: boolean
    fieldClassName?: string
}

const fieldMap = {
    value: '值',
    field: '字段',
    func: '函数',
    raw: '公式'
}

export const Expression: FunctionalComponent<ExpressionProps> = (props, { emit }) => {
    const handleInputTypeChange = (type: 'value' | 'field' | 'func' | 'formula') => {
        let value = props.value
        const onChange = props.onChange

        if (type === 'value') {
            value = ''
        } else if (type === 'func') {
            value = {
                type: 'func',
                func: (findTree(props.funcs!, (item) => (item as Func).type) as Func)?.type,
                args: []
            }
        } else if (type === 'field') {
            value = {
                type: 'field',
                field: ''
            }
        } else if (type === 'formula') {
            value = {
                type: 'formula',
                value: ''
            }
        }
        onChange(value, props.index)
    }

    const handleValueChange = (data: any) => {
        props.onChange(data, props.index)
    }

    const handleFieldChange = (field: string) => {
        let value = props.value
        const onChange = props.onChange
        value = {
            type: 'field',
            field
        }
        onChange(value, props.index)
    }

    const handleFuncChange = (func: any) => {
        let value = props.value
        const onChange = props.onChange
        value = {
            ...func,
            type: 'func'
        }
        onChange(value, props.index)
    }

    const handleFormulaChange = (formula: string) => {
        let value = props.value
        const onChange = props.onChange
        value = {
            type: 'formula',
            value: formula
        }
        onChange(value, props.index)
    }

    const {
        value,
        valueField,
        allowedTypes,
        funcs,
        fields,
        op,
        fieldClassName,
        config,
        data,
        disabled,
        searchable
    } = props

    const inputType =
        ((value as any)?.type === 'field'
            ? 'field'
            : (value as any)?.type === 'func'
            ? 'func'
            : (value as any)?.type === 'formula'
            ? 'formula'
            : value !== undefined
            ? 'value'
            : undefined) ||
        allowedTypes?.[0] ||
        'value'

    const types = allowedTypes || ['value', 'field', 'func']

    if ((!Array.isArray(funcs) || !funcs.length) && ~types.indexOf('func')) {
        types.splice(types.indexOf('func'), 1)
    }

    return (
        <>
            {inputType === 'value' ? (
                <Value
                    field={valueField!}
                    value={value}
                    onChange={handleValueChange}
                    op={op}
                    data={data}
                    disabled={disabled}
                />
            ) : null}

            {inputType === 'field' ? (
                <ConditionField
                    value={(value as any)?.field}
                    onChange={handleFieldChange}
                    fieldClassName={fieldClassName}
                    disabled={disabled}
                    searchable={searchable}
                    options={
                        valueField
                            ? filterTree(
                                  fields!,
                                  (item) =>
                                      (item as any).children ||
                                      (item as FieldSimple).type === valueField.type
                              )
                            : fields!
                    }
                />
            ) : null}

            {inputType === 'func' ? (
                <ConditionFunc
                    config={config}
                    value={value as ExpressionFunc}
                    onChange={handleFuncChange}
                    fieldClassName={fieldClassName}
                    funcs={funcs}
                    fields={fields}
                    allowedTypes={allowedTypes}
                    disabled={disabled}
                />
            ) : null}

            {inputType === 'formula' ? (
                <Formula
                    value={(value as any)?.value}
                    onChange={handleFormulaChange}
                    disabled={disabled}
                />
            ) : null}

            {types.length > 1 ? (
                <InputSwitch
                    disabled={disabled}
                    value={inputType}
                    onChange={handleInputTypeChange}
                    options={types.map((item) => ({
                        label: fieldMap[item],
                        value: item
                    }))}
                />
            ) : null}
        </>
    )
}

export default Expression

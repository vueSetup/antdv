import { FunctionalComponent } from 'vue'
import {
    Fields,
    ConditionRule,
    ConditionGroupValue,
    Funcs,
    ExpressionFunc,
    Func,
    Field,
    FieldSimple,
    ExpressionField,
    OperatorType,
    ExpressionComplex
} from './types'
import { Config, OperationMap } from './config'
import Expression from './Expression'
import { Select } from 'ant-design-vue'
// import PopOverContainer from '../PopOverContainer'
// import ListRadios from '../ListRadios'
// import ResultBox from '../ResultBox'
import { findTree, noop } from './utils/helper'

const option2value = (item: any) => item.value

export interface ConditionItemProps {
    config: Config
    fields: Fields
    funcs?: Funcs
    index?: number
    value: ConditionRule
    data?: any
    disabled?: boolean
    searchable?: boolean
    onChange: (value: ConditionRule, index?: number) => void
    fieldClassName?: string
}

const ConditionItem: FunctionalComponent<ConditionItemProps> = (props) => {
    const handleLeftFieldSelect = (field: any) => {
        const value = { ...props.value }
        const onChange = props.onChange
        value.left = field
        onChange(value, props.index)
    }

    const handleLeftInputTypeChange = (type: 'func' | 'field') => {
        const value = { ...props.value }
        const onChange = props.onChange

        if (type === 'func') {
            value.left = { type: 'func' }
        } else {
            value.left = ''
        }

        onChange(value, props.index)
    }

    const handleLeftChange = (leftValue: any) => {
        const value = {
            ...props.value,
            left: leftValue,
            op: undefined,
            right: undefined
        }
        const onChange = props.onChange

        onChange(value, props.index)
    }

    const handleOperatorChange = (op: OperatorType) => {
        const value = { ...props.value, op: op, right: undefined }
        const onChange = props.onChange
        onChange(value, props.index)
    }

    const handleRightChange = (rightValue: any) => {
        const value = { ...props.value, right: rightValue }
        const onChange = props.onChange

        onChange(value, props.index)
    }

    const handleRightSubChange = (index: number, rightValue: any) => {
        const origin = Array.isArray(props.value?.right) ? props.value.right.concat() : []

        origin[index] = rightValue
        const value = { ...props.value, right: origin }
        const onChange = props.onChange

        onChange(value, props.index)
    }

    const renderLeft = () => {
        const { value, fields, funcs, config, disabled, fieldClassName, searchable } = props
        return (
            <Expression
                config={config}
                funcs={funcs}
                value={value.left}
                fieldClassName={fieldClassName}
                onChange={handleLeftChange}
                fields={fields}
                disabled={disabled}
                searchable={searchable}
                allowedTypes={
                    ['field', 'func'].filter((type) => type === 'field' || type === 'func') as any
                }
            />
        )
    }

    const renderOperator = () => {
        const { funcs, config, fields, value, disabled } = props
        const left = value?.left
        let operators: Array<string> = []

        if ((left as ExpressionFunc)?.type === 'func') {
            const func: Func = findTree(
                funcs!,
                (i: Func) => i.type === (left as ExpressionFunc).func
            ) as Func

            if (func) {
                operators = config.types[func.returnType]?.operators
            }
        } else if ((left as ExpressionField)?.type === 'field') {
            const field: FieldSimple = findTree(
                fields as Array<FieldSimple>,
                (i: FieldSimple) => i.name === (left as ExpressionField).field
            ) as FieldSimple

            if (field) {
                operators = field.operators || config.types[field.type]?.operators
            }
        }

        if (Array.isArray(operators) && operators.length) {
            return (
                <Select
                    disabled={disabled}
                    placeholder="请选择操作"
                    options={operators.map((operator) => ({
                        label: OperationMap[operator as keyof typeof OperationMap],
                        value: operator
                    }))}
                    value={value.op}
                    onChange={handleOperatorChange}
                />
            )
            // return (
            //   <PopOverContainer
            //     popOverRender={({onClose}) => (
            //       <ListRadios
            //         onClick={onClose}
            //         option2value={option2value}
            //         onChange={this.handleOperatorChange}
            //         options={operators.map(operator => ({
            //           label: __(OperationMap[operator as keyof typeof OperationMap]),
            //           value: operator
            //         }))}
            //         value={value.op}
            //         showRadio={false}
            //       />
            //     )}
            //   >
            //     {({onClick, isOpened, ref}) => (
            //       <div className={cx('CBGroup-operator')}>
            //         <ResultBox
            //           className={cx(
            //             'CBGroup-operatorInput',
            //             isOpened ? 'is-active' : ''
            //           )}
            //           ref={ref}
            //           allowInput={false}
            //           result={__(
            //             OperationMap[value?.op as keyof typeof OperationMap]
            //           )}
            //           onResultChange={noop}
            //           onResultClick={onClick}
            //           disabled={disabled}
            //           placeholder={__('Condition.cond_placeholder')}
            //         >
            //           <span className={cx('CBGroup-operatorCaret')}>
            //             <Icon icon="caret" className="icon" />
            //           </span>
            //         </ResultBox>
            //       </div>
            //     )}
            //   </PopOverContainer>
            // )
        }

        return null
    }

    const renderRight = () => {
        const { value, funcs, fields } = props

        if (!value?.op) {
            return null
        }

        const left = value?.left
        let leftType = ''

        if ((left as ExpressionFunc)?.type === 'func') {
            const func: Func = findTree(
                funcs!,
                (i: Func) => i.type === (left as ExpressionFunc).func
            ) as Func

            if (func) {
                leftType = func.returnType
            }
        } else if ((left as ExpressionField)?.type === 'field') {
            const field: FieldSimple = findTree(
                fields as Array<FieldSimple>,
                (i: FieldSimple) => i.name === (left as ExpressionField).field
            ) as FieldSimple

            if (field) {
                leftType = field.type
            }
        }

        if (leftType) {
            return renderRightWidgets(leftType, value.op!)
        }

        return null
    }

    const renderRightWidgets = (type: string, op: OperatorType) => {
        const { funcs, value, data, fields, config, disabled } = props

        let field = {
            ...config.types[type],
            type
        } as FieldSimple

        if ((value?.left as ExpressionField)?.type === 'field') {
            const leftField: FieldSimple = findTree(
                fields as Array<FieldSimple>,
                (i: FieldSimple) => i.name === (value?.left as ExpressionField).field
            ) as FieldSimple

            if (leftField) {
                field = {
                    ...field,
                    ...leftField
                }
            }
        }

        if (op === 'is_empty' || op === 'is_not_empty') {
            return null
        } else if (op === 'between' || op === 'not_between') {
            return (
                <>
                    <Expression
                        config={config}
                        funcs={funcs}
                        valueField={field}
                        value={(value.right as Array<ExpressionComplex>)?.[0]}
                        data={data}
                        onChange={handleRightSubChange.bind(this, 0)}
                        fields={fields}
                        allowedTypes={
                            field?.valueTypes ||
                            config.valueTypes || ['value', 'field', 'func', 'formula']
                        }
                        disabled={disabled}
                    />

                    <span class="CBSeprator">~</span>

                    <Expression
                        config={config}
                        funcs={funcs}
                        valueField={field}
                        value={(value.right as Array<ExpressionComplex>)?.[1]}
                        data={data}
                        onChange={handleRightSubChange.bind(this, 1)}
                        fields={fields}
                        allowedTypes={
                            field?.valueTypes ||
                            config.valueTypes || ['value', 'field', 'func', 'formula']
                        }
                        disabled={disabled}
                    />
                </>
            )
        }

        return (
            <Expression
                config={config}
                op={op}
                funcs={funcs}
                valueField={field}
                value={value.right}
                data={data}
                onChange={handleRightChange}
                fields={fields}
                allowedTypes={
                    field?.valueTypes || config.valueTypes || ['value', 'field', 'func', 'formula']
                }
                disabled={disabled}
            />
        )
    }

    return (
        <div class="CBItem">
            {renderLeft()}
            {renderOperator()}
            {renderRight()}
        </div>
    )
}

export default ConditionItem

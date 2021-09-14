import { FunctionalComponent } from 'vue'
import { Func, ExpressionFunc, Field, Funcs } from './types'
import { Config } from './config'
import Expression from './Expression'
import { Select } from 'ant-design-vue'
// import PopOverContainer from '../PopOverContainer'
// import ListRadios from '../ListRadios'
// import ResultBox from '../ResultBox'
import { findTree, noop } from './utils/helper'

export interface ConditionFuncProps {
    value: ExpressionFunc
    onChange: (value: ExpressionFunc) => void
    disabled?: boolean
    config: Config
    fields?: Field[]
    funcs?: Funcs
    allowedTypes?: Array<'value' | 'field' | 'func' | 'formula'>
    fieldClassName?: string
}

const option2value = (item: Func) => item.type

const ConditionFunc: FunctionalComponent<ConditionFuncProps> = (props) => {
    const handleFuncChange = (type: string) => {
        const value = { ...props.value }
        value.func = type
        props.onChange(value)
    }

    const handleArgChange = (arg: any, index: number) => {
        const value = { ...props.value }
        value.args = Array.isArray(value.args) ? value.args.concat() : []
        value.args.splice(index, 1, arg)
        props.onChange(value)
    }

    const renderFunc = (func: Func) => {
        const { fields, value, funcs, config, disabled } = props

        return (
            <div>
                <span>(</span>
                {Array.isArray(func.args) && func.args.length ? (
                    <div>
                        {func.args.map((item, index) => (
                            <Expression
                                config={config}
                                key={index}
                                index={index}
                                fields={fields}
                                value={value?.args[index]}
                                valueField={{ type: item.type } as any}
                                onChange={handleArgChange}
                                funcs={funcs}
                                disabled={disabled}
                                // allowedTypes={allowedTypes}
                            />
                        ))}
                    </div>
                ) : null}
                <span>)</span>
            </div>
        )
    }

    const { value, fieldClassName, funcs, disabled } = props

    const func = value ? findTree(funcs!, (item) => (item as Func).type === value.func) : null

    return (
        <div class="CBFunc">
            <Select
                placeholder="请选择字段"
                class={fieldClassName}
                disabled={disabled}
                options={funcs}
                value={(func as Func)?.type}
                onChange={handleFuncChange}
            />
            {/* <PopOverContainer
                popOverRender={({ onClose }) => (
                    <ListRadios
                        onClick={onClose}
                        showRadio={false}
                        options={funcs!}
                        value={(func as Func)?.type}
                        option2value={option2value}
                        onChange={this.handleFuncChange}
                    />
                )}
            >
                {({ onClick, ref, isOpened }) => (
                    <div className={cx('CBFunc-select')}>
                        <ResultBox
                            className={cx(
                                'CBGroup-fieldInput',
                                fieldClassName,
                                isOpened ? 'is-active' : ''
                            )}
                            ref={ref}
                            allowInput={false}
                            result={func?.label}
                            onResultChange={noop}
                            onResultClick={onClick}
                            placeholder="请选择字段"
                            disabled={disabled}
                        >
                            <span className={cx('CBGroup-fieldCaret')}>
                                <Icon icon="caret" className="icon" />
                            </span>
                        </ResultBox>
                    </div>
                )}
            </PopOverContainer> */}
            {func ? renderFunc(func as Func) : <span class="CBFunc-error">方法未定义</span>}
        </div>
    )
}

export default ConditionFunc

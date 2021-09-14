import { FunctionalComponent } from 'vue'
import { Input } from 'ant-design-vue'

export interface FormulaProps {
    value: any
    onChange: (value: any) => void
    disabled?: boolean
}

const Formula: FunctionalComponent<FormulaProps> = (props) => {
    const { value, onChange, disabled } = props
    return (
        <div class="CBFormula">
            <Input
                disabled={disabled}
                value={value}
                onChange={onChange}
                placeholder="请输入公式"
                prefix={<span class="CBFormula-label">表达式</span>}
            />
        </div>
    )
}

export default Formula

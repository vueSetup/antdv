import { FunctionalComponent } from 'vue'
import { FieldSimple, OperatorType } from './types'
import { Input, InputNumber, DatePicker, Select, Switch } from 'ant-design-vue'

export interface ValueProps {
    value: any
    data?: any
    onChange: (value: any) => void
    field: FieldSimple
    op?: OperatorType
    disabled?: boolean
}

const Value: FunctionalComponent<ValueProps> = (props) => {
    const { field, value, onChange, op, data, disabled } = props

    let input: JSX.Element | undefined = undefined

    if (field.type === 'text') {
        input = (
            <Input
                value={value ?? field.defaultValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.placeholder}
                disabled={disabled}
            />
        )
    } else if (field.type === 'number') {
        input = (
            <InputNumber
                placeholder={field.placeholder}
                step={field.step}
                min={field.minimum}
                max={field.maximum}
                precision={field.precision}
                value={value ?? field.defaultValue}
                onChange={onChange}
                disabled={disabled}
            />
        )
    } else if (field.type === 'date') {
        input = (
            <DatePicker
                placeholder={field.placeholder}
                format={field.format || 'YYYY-MM-DD'}
                // inputFormat={field.inputFormat || 'YYYY-MM-DD'}
                value={value ?? field.defaultValue}
                onChange={onChange}
                // timeFormat=""
                disabled={disabled}
            />
        )
    } else if (field.type === 'time') {
        input = (
            <DatePicker
                // viewMode="time"
                mode="time"
                placeholder={field.placeholder}
                format={field.format || 'HH:mm'}
                // inputFormat={field.inputFormat || 'HH:mm'}
                value={value ?? field.defaultValue}
                onChange={onChange}
                // dateFormat=""
                // timeFormat={field.format || 'HH:mm'}
                disabled={disabled}
            />
        )
    } else if (field.type === 'datetime') {
        input = (
            <DatePicker
                placeholder={field.placeholder}
                showTime
                format={field.format || 'YYYY-MM-DD HH:mm'}
                // inputFormat={field.inputFormat || 'YYYY-MM-DD HH:mm'}
                value={value ?? field.defaultValue}
                onChange={onChange}
                // timeFormat={field.timeFormat || 'HH:mm'}
                disabled={disabled}
            />
        )
    } else if (field.type === 'select') {
        input = (
            <Select
                // simpleValue
                options={field.options!}
                // source={field.source}
                showSearch={field.searchable}
                value={value ?? field.defaultValue ?? ''}
                // data={data}
                onChange={onChange}
                // multiple={op === 'select_any_in' || op === 'select_not_any_in'}
                disabled={disabled}
            />
        )
    } else if (field.type === 'boolean') {
        input = (
            <Switch checked={value ?? field.defaultValue} onChange={onChange} disabled={disabled} />
        )
    }

    return <div class="CBValue">{input}</div>
}

export default Value

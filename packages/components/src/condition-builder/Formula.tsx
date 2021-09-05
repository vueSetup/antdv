import { defineComponent, PropType } from 'vue';
import { Input } from 'ant-design-vue';

// export interface FormulaProps {
//   value: any;
//   onChange: (value: any) => void;
// }

const FormulaProps = {
  value: String,
  onChange: Function as PropType<(value: any) => void>,
  disabled: Boolean
}

export const Formula = defineComponent({
  props: FormulaProps,
  render() {
    const { value, onChange, disabled } = this.$props;
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
})

export default Formula;

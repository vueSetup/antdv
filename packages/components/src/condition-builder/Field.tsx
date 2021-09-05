import { defineComponent, PropType } from 'vue';
// import PopOverContainer from '../PopOverContainer';
// import ListRadios from '../ListRadios';
// import ResultBox from '../ResultBox';
import { Select } from 'ant-design-vue'
// import { findTree, noop } from '../utils/helper';

// export interface ConditionFieldProps {
//   options: Array<any>;
//   value: any;
//   onChange: (value: any) => void;
// }

const ConditionFieldProps = {
  options: Array as PropType<Array<any>>,
  value: String,
  onChange: Function as PropType<(value: any) => void>,
  disabled: Boolean,
  fieldClassName: String
}

// const option2value = (item: any) => item.name;

export const ConditionField = defineComponent({
  props: ConditionFieldProps,
  render() {
    const { options, value, onChange, fieldClassName, disabled } = this.$props;

    return (
      // <PopOverContainer
      //   popOverRender={({ onClose }) => (
      //     <ListRadios
      //       onClick={onClose}
      //       showRadio={false}
      //       options={options}
      //       value={value}
      //       option2value={option2value}
      //       onChange={onChange}
      //     />
      //   )}
      // >
      //   {({ onClick, ref, isOpened }) => (
      //     <div className={cx('CBGroup-field')}>
      //       <ResultBox
      //         className={cx('CBGroup-fieldInput', isOpened ? 'is-active' : '')}
      //         ref={ref}
      //         allowInput={false}
      //         result={
      //           value ? findTree(options, item => item.name === value)?.label : ''
      //         }
      //         onResultChange={noop}
      //         onResultClick={onClick}
      //         placeholder="请选择字段"
      //       >
      //         <span className={cx('CBGroup-fieldCaret')}>
      //           <Icon icon="caret" className="icon" />
      //         </span>
      //       </ResultBox>
      //     </div>
      //   )}
      // </PopOverContainer>
      <Select
        placeholder="请选择字段"
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
        class={fieldClassName}
      />
    )
  }
})

export default ConditionField;

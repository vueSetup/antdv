import { defineComponent, PropType } from 'vue';
// import PopOverContainer from '../PopOverContainer';
// import ListRadios from '../ListRadios';
import { Select } from 'ant-design-vue'

// export interface InputSwitchProps {
//   options: Array<any>;
//   value: any;
//   onChange: (value: any) => void;
// }

const InputSwitchProps = {
  options: Array,
  disabled: Boolean,
  value: String,
  onChange: Function as PropType<(value: any) => void>,
}

// const option2value = (item: any) => item.value;

export const InputSwitch = defineComponent({
  props: InputSwitchProps,
  render() {
    const {
      options,
      value,
      onChange,
      disabled
    } = this.$props
    return (
      // <PopOverContainer
      //   popOverRender={({ onClose }) => (
      //     <ListRadios
      //       onClick={onClose}
      //       option2value={option2value}
      //       onChange={onChange}
      //       options={options}
      //       value={value}
      //       showRadio={false}
      //     />
      //   )}
      // >
      //   {({ onClick, isOpened, ref }) => (
      //     <div className={cx('CBInputSwitch', isOpened ? 'is-active' : '')}>
      //       <a onClick={onClick} ref={ref}>
      //         <Icon icon="ellipsis-v" />
      //       </a>
      //     </div>
      //   )}
      // </PopOverContainer>
      <Select
        allowClear
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
})

export default InputSwitch

import { FunctionalComponent } from 'vue'
import { Select } from 'ant-design-vue'
// import PopOverContainer from '../PopOverContainer'
// import ListRadios from '../ListRadios'

export interface InputSwitchProps {
    options: Array<any>
    disabled?: boolean
    value: any
    onChange: (value: any) => void
}

const option2value = (item: any) => item.value

const InputSwitch: FunctionalComponent<InputSwitchProps> = (props) => {
    const { options, value, onChange, disabled } = props
    return (
        <Select
            allowClear
            options={options}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    )
    // return (
    //     <PopOverContainer
    //         popOverRender={({ onClose }) => (
    //             <ListRadios
    //                 onClick={onClose}
    //                 option2value={option2value}
    //                 onChange={onChange}
    //                 options={options}
    //                 value={value}
    //                 showRadio={false}
    //                 disabled={disabled}
    //             />
    //         )}
    //     >
    //         {({ onClick, isOpened, ref }) => (
    //             <div className={cx('CBInputSwitch', isOpened ? 'is-active' : '')}>
    //                 <a onClick={onClick} ref={ref}>
    //                     <Icon icon="ellipsis-v" />
    //                 </a>
    //             </div>
    //         )}
    //     </PopOverContainer>
    // )
}

export default InputSwitch


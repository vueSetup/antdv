import { FunctionalComponent } from 'vue'
import { Select } from 'ant-design-vue'
// import PopOverContainer from '../PopOverContainer'
// import ListRadios from '../ListRadios'
// import ResultBox from '../ResultBox'
// import { findTree, noop } from './utils/helper'

export interface ConditionFieldProps {
    options: Array<any>
    value: any
    onChange: (value: any) => void
    disabled?: boolean
    fieldClassName?: string
    searchable?: boolean
}

const option2value = (item: any) => item.name

const ConditionField: FunctionalComponent<ConditionFieldProps> = (props) => {
    const { options, onChange, value, fieldClassName, disabled, searchable } = props
    return (
        <Select
            placeholder="请选择字段"
            class={fieldClassName}
            disabled={disabled}
            options={options}
            value={value}
            onChange={onChange}
        />
    )
    // return (
    //     <PopOverContainer
    //         popOverRender={({ onClose }) => (
    //             <>
    //                 {searchable ? <SearchBox mini={false} onSearch={this.onSearch} /> : null}
    //                 <ListRadios
    //                     onClick={(e) => this.onPopClose(e, onClose)}
    //                     showRadio={false}
    //                     options={this.state.options}
    //                     value={value}
    //                     option2value={option2value}
    //                     onChange={onChange}
    //                 />
    //             </>
    //         )}
    //     >
    //         {({ onClick, ref, isOpened }) => (
    //             <div className={cx('CBGroup-field')}>
    //                 <ResultBox
    //                     className={cx(
    //                         'CBGroup-fieldInput',
    //                         fieldClassName,
    //                         isOpened ? 'is-active' : ''
    //                     )}
    //                     ref={ref}
    //                     allowInput={false}
    //                     result={
    //                         value ? findTree(options, (item) => item.name === value)?.label : ''
    //                     }
    //                     onResultChange={noop}
    //                     onResultClick={onClick}
    //                     placeholder={__('Condition.field_placeholder')}
    //                     disabled={disabled}
    //                 >
    //                     <span className={cx('CBGroup-fieldCaret')}>
    //                         <Icon icon="caret" className="icon" />
    //                     </span>
    //                 </ResultBox>
    //             </div>
    //         )}
    //     </PopOverContainer>
    // )
}

export default ConditionField

import { FunctionalComponent } from 'vue'
import Space, { SpaceProps } from 'ant-design-vue/es/space'
import { CustomRender } from '../typings'

export interface FormGroupProps {
    title?: CustomRender
    // tooltip?: CustomRender
    extra?: CustomRender
    // spaceProps?: SpaceProps
}

const FormGroup: FunctionalComponent<FormGroupProps> = (props, { slots }) => {
    const prefixCls = 'ant-pro'
    const { title, extra } = props

    const baseClassName = `${prefixCls}-form-group`
    return (
        <div class={baseClassName}>
            <div class={`${baseClassName}-title`}>
                {extra ? (
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        {title}
                        <span>{extra}</span>
                    </div>
                ) : (
                    title
                )}
            </div>
            {/* <Space {...props.spaceProps}>{slots.default?.()}</Space> */}
            {slots.default?.()}
        </div>
    )
}

FormGroup.inheritAttrs = false

export default FormGroup

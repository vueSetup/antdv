import { defineComponent, PropType, VNodeChild } from 'vue'
import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes'
import { Space, Button } from 'ant-design-vue'

type VueNode = VNodeChild | JSX.Element

export const SubmitterProps = {
    submitButtonProps: Object as PropType<ButtonProps>,
    submitText: String,
    onSubmit: Function as PropType<(e: Event) => void>,
    resetButtonProps: Object as PropType<ButtonProps>,
    resetText: String,
    onReset: Function as PropType<(e: Event) => void>,
    render: Function as PropType<(buttons: Array<VueNode>) => VueNode | Array<VueNode>>
}

const Submitter = defineComponent({
    props: SubmitterProps,
    render() {
        const {
            submitButtonProps,
            submitText = '提交',
            onSubmit,
            resetButtonProps,
            resetText = '重置',
            onReset,
            render
        } = this.$props

        const buttons = [
            <Button
                key="submit"
                {...submitButtonProps}
                type="primary"
                onClick={(e) => {
                    onSubmit(e)
                }}>
                {submitText}
            </Button>,
            <Button
                key="rest"
                {...resetButtonProps}
                onClick={(e) => {
                    onReset(e)
                }}>
                {resetText}
            </Button>
        ]

        const renderButtons = render ? render(buttons) : buttons
        if (!renderButtons) {
            return null
        }
        if (Array.isArray(renderButtons)) {
            if (renderButtons?.length < 1) {
                return null
            }
            return <Space>{renderButtons}</Space>
        }
        return renderButtons
    }
})

export default Submitter

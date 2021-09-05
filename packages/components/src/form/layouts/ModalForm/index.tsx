import { defineComponent, reactive, PropType, toRefs } from 'vue'
import BasicForm, { BasicFormProps } from '../../BasicForm'
import BasicFormItem, { BasicFormItemProps } from '../../BasicFormItem'
import { Modal } from 'ant-design-vue'
import type { CustomRender } from '../../../typings'

export const ModalFormProps = {
    ...BasicFormProps,
    modalProps: Object,
    trigger: Object as PropType<CustomRender>
}

const ModalForm = defineComponent({
    props: ModalFormProps,
    setup(props, { slots, emit }) {
        const state = reactive({
            visible: false
        })
        return { ...toRefs(state) }
    },
    render() {
        const { trigger, modalProps, onFinish, ...others } = this.$props
        return (
            <>
                {trigger && <trigger onClick={() => { this.visible = !this.visible }} />}
                <Modal
                    {...modalProps}
                    visible={this.visible}
                    //TODO
                    footer={null}
                    onCancel={(e) => { this.visible = false; modalProps?.onCancel?.(e) }}
                >
                    <BasicForm
                        {...others}
                        v-slots={this.$slots}
                        onFinish={(modelRef: Record<string, any>) => {
                            this.visible = false
                            onFinish(modelRef)
                        }}
                    >
                        {this.$slots.default?.()}
                    </BasicForm>
                </Modal>
            </>
        )
    }
})

ModalForm.Item = BasicFormItem

export default ModalForm as typeof ModalForm &
    Plugin & {
        readonly Item: typeof BasicFormItem
    }


import './index.less'

import { defineComponent, reactive, PropType, toRefs } from 'vue'
import BasicForm, { BasicFormProps } from '../../BasicForm'
import BasicFormItem, { BasicFormItemProps } from '../../BasicFormItem'
import { Drawer } from 'ant-design-vue'
import { CustomRender } from '../../../typings'

export const DrawerFormProps = {
    ...BasicFormProps,
    drawerProps: Object,
    trigger: Object as PropType<CustomRender>
}

const DrawerForm = defineComponent({
    props: DrawerFormProps,
    setup(props, { slots, emit }) {
        const state = reactive({
            visible: false
        })
        return { ...toRefs(state) }
    },
    render() {
        const { trigger, drawerProps, onFinish, ...others } = this.$props
        const children = this.$slots.default?.() || []
        return (
            <>
                {trigger && (
                    <trigger
                        onClick={() => {
                            this.visible = !this.visible
                        }}
                    />
                )}
                <Drawer
                    wrapClassName="drawer"
                    {...drawerProps}
                    visible={this.visible}
                    onClose={(e) => {
                        this.visible = false
                        drawerProps?.onClose?.(e)
                    }}>
                    <BasicForm
                        {...others}
                        v-slots={this.$slots}
                        onFinish={(modelRef: Record<string, any>) => {
                            this.visible = false
                            onFinish(modelRef)
                        }}
                    />
                </Drawer>
            </>
        )
    }
})

DrawerForm.Item = BasicFormItem

export default DrawerForm as typeof DrawerForm &
    Plugin & {
        readonly Item: typeof BasicFormItem
    }

import { defineComponent, ExtractPropTypes, watch } from 'vue'
import FormItem, { formItemProps } from 'ant-design-vue/es/form/FormItem'
import { useFormContext } from './context'

export const basicFormItemProps = {
    ...formItemProps
}

export type BasicFormItemProps = ExtractPropTypes<typeof basicFormItemProps>

const BasicFormItem = defineComponent({
    props: basicFormItemProps,
    setup(props, { slots }) {
        const { modelRef, rulesRef, validateInfos, register } = useFormContext()

        // watch(
        //     () => cloneDeep(validateInfos),
        //     (validateInfos, preValidateInfos) => {
        //         // console.log('BasicFormItem', validateInfos)
        //         // console.table(preValidateInfos)
        //     },
        //     { deep: true }
        // )

        register(props)

        return { modelRef, rulesRef, validateInfos }
    },
    render() {
        const { name, rules, ...others } = this.$props
        const fieldName = name as string
        const children = this.$slots.default?.(this.modelRef) ?? []
        const firstChildren = children.length ? children[0] : null
        if (fieldName && firstChildren) {
            firstChildren.props = {
                ...firstChildren.props,
                ...{
                    value: this.modelRef[fieldName],
                    'onUpdate:value': (value: any) => {
                        this.modelRef[fieldName] = value
                    }
                }
            }
        }

        return (
            <FormItem {...others} {...this.validateInfos[fieldName]}>
                {[firstChildren, children.slice(1)]}
            </FormItem>
        )
    }
})

export default BasicFormItem

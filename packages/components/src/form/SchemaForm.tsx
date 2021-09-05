import { defineComponent, reactive, watch, toRaw, PropType } from 'vue'
import BaseForm, { BasicFormProps } from './BasicForm'
import DrawerForm, { DrawerFormProps } from './layouts/DrawerForm'
import ModalForm, { ModalFormProps } from './layouts/ModalForm'
import { QueryFilterProps } from './layouts/QueryFilter'

import { Form } from 'ant-design-vue'
const { useForm } = Form

export const SchemaFormProps = {
    ...BasicFormProps,
    ...DrawerFormProps,
    ...ModalFormProps,
    ...QueryFilterProps,
    layoutType: {
        type: String as PropType<
            'Form' | 'ModalForm' | 'DrawerForm' | 'QueryFilter'
        >,
        default: 'Form'
    },
    schema: Map as PropType<Map<string, any>>
}
const FormComments = {
    DrawerForm,
    ModalForm
}
const SchemaForm = defineComponent({
    props: SchemaFormProps,
    setup(props, { slots, emit }) {
        const { schema } = props

        const modelRef = reactive<Record<string, any>>({})
        const rulesRef = reactive<Record<string, Array<Record<string, any>>>>(
            {}
        )

        for (const [name, field] of schema) {
            modelRef[name] = undefined
            if (field.rules) rulesRef[name] = field.rules
        }

        watch(
            () => props.initialValues,
            (initialValues) => {
                // Object.assign(modelRef, { ...initialValues })
            },
            { immediate: true, deep: true }
        )

        const { validateInfos, validate, resetFields } = useForm(
            modelRef,
            rulesRef,
            { deep: true, debounce: { wait: 268 } }
        )

        const onSubmit = (e: Event) => {
            emit('submit', e)
        }

        const onFinish = (modelRef: Record<string, any>) => {
            emit('finish', modelRef)
        }

        const onFinishFailed = (err: any, modelRef: Record<string, any>) => {
            emit('finishFailed', err, modelRef)
        }

        return {
            modelRef,
            validateInfos,
            onSubmit,
            onFinish,
            onFinishFailed
        }
    },
    render() {
        const { schema, layoutType, ...others } = this.$props
        const Form = FormComments[layoutType] || BaseForm
        return (
            <Form
                onSubmit={this.onSubmit}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                {...others}></Form>
        )
    }
})

export default SchemaForm

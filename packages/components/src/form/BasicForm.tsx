import {
    defineComponent,
    reactive,
    watch,
    onMounted,
    toRaw,
    toRefs,
    PropType,
    ExtractPropTypes,
    Plugin
} from 'vue'
import ContextProvider, { Context } from './context'
import Form, { formProps } from 'ant-design-vue/es/form/Form'
import BasicFormItem, { BasicFormItemProps } from './BasicFormItem'
import FormGroup, { FormGroupProps } from './Group'
import Submitter, { SubmitterProps } from './Submitter'
import { useForm } from 'ant-design-vue/es/form'
import { ActionType } from './typings'
import { pickBy, identity } from 'lodash-es'
import { WithFalse } from './typings'

export const basicFormProps = {
    ...formProps,
    debug: Boolean,
    initialValues: Object as PropType<Record<string, any>>,
    submitter: Object as PropType<WithFalse<ExtractPropTypes<typeof SubmitterProps>>>,
    omitNil: Boolean,
    actionRef: Object as PropType<ActionType>
}

export type BasicFormProps = ExtractPropTypes<typeof basicFormProps>

const BasicForm = defineComponent({
    props: basicFormProps,
    setup(props, { slots, emit }) {
        const {
            debug,
            submitter,
            omitNil,
            actionRef = { resetFields: () => {} },
            ...others
        } = props

        const context = reactive<Context>({
            modelRef: props.model || {},
            rulesRef: props.rules || {},
            validateInfos: {}
        })

        onMounted(() => {
            const { validateInfos, resetFields, validate, mergeValidateInfo, clearValidate } =
                useForm(context.modelRef, context.rulesRef, {
                    deep: true,
                    debounce: { wait: 168 }
                })
            Object.assign(context.validateInfos, validateInfos)
            actionRef.resetFields = resetFields
            actionRef.validate = validate
            actionRef.mergeValidateInfo = mergeValidateInfo
            actionRef.clearValidate = clearValidate
        })

        watch(
            () => props.initialValues,
            (initialValues) => {
                Object.keys(context.modelRef)
                    .filter((key) => !Object.keys(initialValues).includes(key))
                    .map((key) => {
                        delete context.modelRef[key]
                    })
                Object.assign(context.modelRef, initialValues)
            },
            { immediate: true, deep: true, flush: 'post' }
        )

        const register = (props: BasicFormItemProps) => {
            const fieldName = props.name as string
            if (!fieldName) return
            if (!Object.keys(context.modelRef).includes(fieldName)) {
                context.modelRef[fieldName] = undefined
            }
            if (props.rules || props.required) {
                context.rulesRef[fieldName] = props.rules || []
                if (props.required) {
                    // @ts-ignore
                    context.rulesRef[fieldName].push({
                        required: true,
                        message: `请输入${props.label}`
                    })
                }
            }
        }

        /**
         * Remove all falsey values in object.
         * https://stackoverflow.com/questions/30812765/how-to-remove-undefined-and-null-values-from-an-object-using-lodash
         */
        const omitNilValues = (values) => pickBy(values, identity)

        const onSubmit = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()

            const values = omitNil
                ? omitNilValues(toRaw(context.modelRef))
                : toRaw(context.modelRef)

            emit('submit', values)

            actionRef
                .validate()
                .then(() => {
                    emit('finish', values)
                })
                .catch((err) => {
                    emit('finishFailed', err, values)
                })
        }

        const onReset = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()

            actionRef.resetFields(props.initialValues)
        }

        return () => (
            <>
                {debug && <p>{JSON.stringify(context.modelRef)}</p>}
                <Form {...others} onSubmit={onSubmit}>
                    <ContextProvider
                        value={{
                            ...toRefs(context),
                            register
                        }}
                    >
                        {slots.default?.()}
                        {submitter !== false ? (
                            <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                                <Submitter {...submitter} onSubmit={onSubmit} onReset={onReset} />
                            </Form.Item>
                        ) : null}
                    </ContextProvider>
                </Form>
            </>
        )
    }
})

BasicForm.Item = BasicFormItem
BasicForm.Group = FormGroup

export default BasicForm as typeof BasicForm &
    Plugin & {
        readonly Group: typeof FormGroup
        readonly Item: typeof BasicFormItem
    }

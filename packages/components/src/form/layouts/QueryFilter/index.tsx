import { defineComponent, PropType } from 'vue'
import Form, { formProps } from 'ant-design-vue/es/form/Form'
import BasicForm, { BasicFormProps } from '../../BasicForm'
import BasicFormItem, { BasicFormItemProps } from '../../BasicFormItem'
import { Row, Col } from 'ant-design-vue'
import Submitter, { SubmitterProps } from '../../Submitter'

export const QueryFilterProps = {
    ...BasicFormProps,
}

const QueryFilter = defineComponent({
    props: QueryFilterProps,
    setup(props, { slots, emit }) {
    },
    render() {
        const { submitter, ...others } = this.$props
        const formItems = this.$slots.default?.() ?? []
        return (
            <BasicForm
                {...others}
                submitter={{ render: () => null }}
                onSubmit={(modelRef: Record<string, any>) => {
                    this.$emit('submit', modelRef)
                }}
                onFinish={(modelRef: Record<string, any>) => {
                    this.$emit('finish', modelRef)
                }}
                onFinishFailed={(err: any, modelRef: Record<string, any>) => {
                    this.$emit('finishFailed', err, modelRef)
                }}
            >
                <Row justify="start">
                    {
                        formItems.map(formItem => (
                            <Col span={6}>
                                {formItem}
                            </Col>
                        ))
                    }
                    <Col span={6}>
                        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                            <Submitter {...submitter} onSubmit={this.onSubmit} />
                        </Form.Item>
                    </Col>
                </Row>
            </BasicForm>
        )
    }
})

QueryFilter.Item = BasicFormItem

export default QueryFilter as typeof QueryFilter &
    Plugin & {
        readonly Item: typeof BasicFormItem
    }

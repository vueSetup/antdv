import { InjectionKey } from 'vue'
import { ValidationRule } from 'ant-design-vue/es/form/Form'
import { createContext, useContext } from '../composables'
import BasicFormItem, { BasicFormItemProps } from './BasicFormItem'
import { ValidateInfo } from 'ant-design-vue/es/form/useForm'

export interface Context {
    modelRef: Record<string, any>
    rulesRef: Record<string, ValidationRule | ValidationRule[]>,
    validateInfos: Record<string, ValidateInfo>,
    register?: (formItemProps: BasicFormItemProps) => void
}

export const contextKey: InjectionKey<Context> = Symbol()

export const useFormContext = () =>
    useContext<Required<Context>>(contextKey)

export default createContext<Context>(contextKey, 'Form.Context.Provider')

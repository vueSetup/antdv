export * from "../typings"

import { ValidateInfo } from "ant-design-vue/es/form/useForm"

export type ActionType = {
    resetFields: (newValues?: Record<string, any>) => void
    validate?: <T = any>(
        names?: string | string[],
        option?: Record<string, ValidateInfo>
    ) => Promise<T>
    mergeValidateInfo?: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo
    clearValidate?: (names?: string | string[]) => void
}
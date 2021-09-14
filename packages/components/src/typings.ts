import { Slot, VNode, VNodeChild } from 'vue'

export type WithFalse<T> = false | T

export type CustomRender =
    | Slot
    | VNode
    | JSX.Element
    | ((...props: any[]) => Slot)
    | ((...props: any[]) => VNode)
    | ((...args: any[]) => VNode)
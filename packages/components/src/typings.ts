import { Slot, VNode, VNodeChild } from 'vue'

export type WithFalse<T> = false | T

export type CustomRender =
    | Slot
    | VNode
    | VNode[]
    | VNodeChild
    | JSX.Element
    | ((...props: any[]) => Slot)
    | ((...props: any[]) => VNode)
    | ((...args: any[]) => VNode)
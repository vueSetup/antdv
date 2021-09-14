import './index.less'

import { defineComponent, reactive, watchEffect, toRefs, PropType, ExtractPropTypes } from 'vue'
import { Fields, ConditionGroupValue, Funcs } from './types'
import defaultConfig, { Config } from './config'
import ConditionGroup from './Group'
import { findTreeIndex, spliceTree, getTree, mapTree, guid } from './utils/helper'
import animtion from './utils/Animation'

// export interface ConditionBuilderProps {
//     fields: Fields
//     funcs?: Funcs
//     showNot?: boolean
//     value?: ConditionGroupValue
//     data?: any
//     onChange: (value: ConditionGroupValue) => void
//     config?: Config
//     disabled?: boolean
//     searchable?: boolean
//     fieldClassName?: string
// }

export const conditionBuilderProps = {
    fields: Array as PropType<Fields>,
    funcs: Array as PropType<Funcs>,
    showNot: Boolean,
    value: Object as PropType<ConditionGroupValue>,
    data: Object as PropType<any>,
    onChange: Function as PropType<(value: ConditionGroupValue) => void>,
    config: Object as PropType<Config>,
    disabled: Boolean,
    searchable: Boolean,
    fieldClassName: String
}

export type ConditionBuilderProps = ExtractPropTypes<typeof conditionBuilderProps>

const ConditionBuilder = defineComponent({
    props: conditionBuilderProps,
    setup(props, { emit }) {
        const state = reactive<{
            config?: Config
            dragTarget?: HTMLElement
            // dragNextSibling: Element | null
            ghost?: HTMLElement
            host?: HTMLElement
            lastX: number
            lastY: number
            lastMoveAt: number
        }>({
            config: { ...defaultConfig, ...props.config },
            lastX: 0,
            lastY: 0,
            lastMoveAt: 0
        })

        watchEffect(() => {
            state.config = { ...defaultConfig, ...props.config }
        })

        const handleDragStart = (e: DragEvent) => {
            const target = e.currentTarget as HTMLElement
            const item = target.closest('[data-id]') as HTMLElement
            state.dragTarget = item
            // state.dragNextSibling = item.nextElementSibling;
            state.host = item.closest('[data-group-id]') as HTMLElement

            const ghost = item.cloneNode(true) as HTMLElement
            ghost.classList.add('is-ghost')
            state.ghost = ghost

            e.dataTransfer.setDragImage(item.firstChild as HTMLElement, 0, 0)

            target.addEventListener('dragend', handleDragEnd)
            document.body.addEventListener('dragover', handleDragOver)
            document.body.addEventListener('drop', handleDragDrop)
            state.lastX = e.clientX
            state.lastY = e.clientY

            // 应该是 chrome 的一个bug，如果你马上修改，会马上执行 dragend
            setTimeout(() => {
                item.classList.add('is-dragging')
                // item.parentElement!.insertBefore(
                //   item,
                //   item.parentElement!.firstElementChild
                // ); // 挪到第一个，主要是因为样式问题。
            }, 5)
        }

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault()
            const item = (e.target as HTMLElement).closest('[data-id]') as HTMLElement

            const dx = e.clientX - state.lastX
            const dy = e.clientY - state.lastY
            const d = Math.max(Math.abs(dx), Math.abs(dy))
            const now = Date.now()

            // 没移动还是不要处理，免得晃动个不停。
            if (d < 5) {
                if (state.lastMoveAt === 0) {
                } else if (now - state.lastMoveAt > 500) {
                    const host = (e.target as HTMLElement).closest('[data-group-id]') as HTMLElement

                    if (host) {
                        state.host = host
                        state.lastMoveAt = now
                        state.lastX = 0
                        state.lastY = 0
                        handleDragOver(e)
                        return
                    }
                }
                return
            }

            state.lastMoveAt = now
            state.lastX = e.clientX
            state.lastY = e.clientY

            if (
                !item ||
                item.classList.contains('is-ghost') ||
                item.closest('[data-group-id]') !== state.host
            ) {
                return
            }

            const container = item.parentElement!
            const children = [].slice.apply(container!.children)

            const idx = children.indexOf(item)

            if (state.ghost!.parentElement !== container) {
                container.appendChild(state.ghost!)
            }

            const rect = item.getBoundingClientRect()
            const isAfter = dy > 0 && e.clientY > rect.top + rect.height / 2
            const gIdx = isAfter ? idx : idx - 1
            const cgIdx = children.indexOf(state.ghost)

            if (gIdx !== cgIdx) {
                animtion.capture(container)

                if (gIdx === children.length - 1) {
                    container.appendChild(state.ghost!)
                } else {
                    container.insertBefore(state.ghost!, children[gIdx + 1])
                }

                animtion.animateAll()
            }
        }

        const handleDragDrop = () => {
            const onChange = props.onChange
            const fromId = state.dragTarget!.getAttribute('data-id')!
            const toId = state.host.getAttribute('data-group-id')!
            const children = [].slice.call(state.ghost!.parentElement!.children)
            const idx = children.indexOf(state.dragTarget)

            if (~idx) {
                children.splice(idx, 1)
            }

            const toIndex = children.indexOf(state.ghost)
            let value = props.value!

            const indexes = findTreeIndex([value], (item) => item.id === fromId)

            if (indexes) {
                const origin = getTree([value], indexes.concat())!
                ;[value] = spliceTree([value]!, indexes, 1)

                const indexes2 = findTreeIndex([value], (item) => item.id === toId)

                if (indexes2) {
                    ;[value] = spliceTree([value]!, indexes2.concat(toIndex), 0, origin)
                    onChange(value)
                }
            }
        }

        const handleDragEnd = (e: Event) => {
            const target = e.target as HTMLElement

            target.removeEventListener('dragend', handleDragEnd)
            document.body.removeEventListener('dragover', handleDragOver)
            document.body.removeEventListener('drop', handleDragDrop)

            state.dragTarget!.classList.remove('is-dragging')
            // if (state.dragNextSibling) {
            //   state.dragTarget.parentElement!.insertBefore(
            //     state.dragTarget,
            //     state.dragNextSibling
            //   );
            // } else {
            //   state.dragTarget.parentElement!.appendChild(state.dragTarget);
            // }
            delete state.dragTarget
            // delete state.dragNextSibling;
            state.ghost!.parentElement?.removeChild(state.ghost!)
            delete state.ghost
        }

        return { ...toRefs(state), handleDragStart }
    },
    render() {
        const {
            fieldClassName,
            fields,
            funcs,
            onChange,
            value,
            showNot,
            data,
            disabled,
            searchable
        } = this.$props

        const normalizedValue = Array.isArray(value?.children)
            ? {
                  ...value,
                  children: mapTree(value!.children, (value: any) => {
                      if (value.id) {
                          return value
                      }

                      return {
                          ...value,
                          id: guid()
                      }
                  })
              }
            : value

        return (
            <ConditionGroup
                config={this.config}
                funcs={funcs || this.config.funcs}
                fields={fields || this.config.fields}
                value={normalizedValue as any}
                onChange={onChange}
                fieldClassName={fieldClassName}
                removeable={false}
                onDragStart={this.handleDragStart}
                showNot={showNot}
                data={data}
                disabled={disabled}
                searchable={searchable}
            />
        )
    }
})

export default ConditionBuilder

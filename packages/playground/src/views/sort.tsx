import { defineComponent, onMounted, shallowReactive, shallowRef } from 'vue'

export default defineComponent({
    setup() {
        const ulRef = shallowRef<HTMLElement | null>(null)

        onMounted(() => {
            if (ulRef.value) {
                const container = ulRef.value as HTMLElement
                Array.from(container.children).forEach((itemEle) => {
                    //@ts-ignore
                    itemEle.draggable = true
                })
                container.ondragstart = (e: DragEvent) => {
                    const dragEle = e.target as HTMLElement

                    e.dataTransfer!.effectAllowed = 'move'
                    
                    e.dataTransfer!.setData('Text', dragEle.innerHTML)

                    container.ondragover = (e: DragEvent) => {
                        e.preventDefault()

                        e.dataTransfer!.dropEffect = 'move'

                        var target = e.target as HTMLElement

                        if (target && target !== dragEle && target.nodeName == 'LI') {
                            // let nextEle
                            // if (container.children[0] == target) {
                            //     nextEle = target
                            // } else if (target.nextElementSibling) {
                            //     nextEle = target.nextElementSibling
                            // } else {
                            //     nextEle = null
                            // }
                            const nextEle =
                                container.children[0] == target ? target : target.nextElementSibling
                            container.insertBefore(dragEle, nextEle)
                        }
                    }
                    container.ondragend = (e: DragEvent) => {
                        e.preventDefault()
                    }
                }
            }
        })

        return () => (
            <ul ref={ulRef}>
                <li>ABC1</li>
                <li>ABC2</li>
                <li>ABC3</li>
                <li>ABC4</li>
                <li>ABC5</li>
                <li>ABC6</li>
            </ul>
        )
    }
})

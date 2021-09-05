import { defineComponent, PropType } from 'vue'
import Tree, { TreeProps, TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import { ActionType } from '../typings'
import styles from './index.module.less'

export const ExplorerTreeProps = {
    ...TreeProps(),
    actionRef: Object as PropType<ActionType>
}

const ExplorerTree = defineComponent({
    name: 'AExplorerTree',
    props: ExplorerTreeProps,
    setup(props, { emit }) {
        const { actionRef = { reload: () => { } }, loadData } = props

        actionRef.reload = () => { }

        const onLoadData = (treeNode: { dataRef: TreeDataItem }) => {
            if (typeof treeNode.dataRef.loadData === 'function') {
                return treeNode.dataRef.loadData()
            } else {
                return loadData(treeNode)
            }
        }

        return { onLoadData }
    },
    render() {
        const { actionRef, ...others } = this.$props

        return <Tree class={styles.explorerTree} {...others} v-slots={this.$slots} loadData={this.onLoadData} />
    }
})

export default ExplorerTree

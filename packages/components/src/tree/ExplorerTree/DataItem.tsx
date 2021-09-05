import { isVNode, VNode, VNodeChild } from 'vue'
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import { RouterLink } from 'vue-router'
import { Row, Col, Dropdown, Menu, TreeNode } from 'ant-design-vue'
import { MoreOutlined } from '@ant-design/icons-vue'
import styles from './index.module.less'

export class ExplorerTreeNode {
    dataItem: TreeDataItem = {}

    constructor(dataItem?: TreeDataItem) {
        this.dataItem = dataItem || {}
    }

    setKey = (key: string | number) => {
        this.dataItem.key = key
        return this
    }

    setIcon(icon: VNode) {
        this.dataItem.icon = icon
        return this
    }

    setTitle = (title: VNodeChild) => {
        // @ts-ignore
        this.dataItem.title = title
        return this
    }

    setRouterLink = (path: string) => {
        const { title } = { ...this.dataItem }
        // @ts-ignore
        this.dataItem.title = <RouterLink to={path}>{title}</RouterLink>
        return this
    }

    setMenuItems = (menuItems: VNodeChild) => {
        const { title } = { ...this.dataItem }
        const titleRender = ({ expanded }) => {
            const classNames = {
                ['ant-tree-node-content-wrapper']: true,
                ['ant-tree-node-content-wrapper-open']: expanded,
                ['ant-tree-node-content-wrapper-close']: !expanded
            }

            return (
                <span class={classNames}>
                    <Row type="flex" justify="space-between">
                        <Col>{title}</Col>
                        <Col class={styles.more}>
                            <Dropdown
                                class="ant-pro-dropdown ant-pro-dropdown-action"
                                overlayClassName="pro-components-header-dropdown-index-container"
                                trigger={['click']}
                                placement={'bottomRight'}
                                overlay={
                                    <Menu class="ant-pro-dropdown-menu" mode="vertical">
                                        {menuItems}
                                    </Menu>
                                }>
                                <MoreOutlined />
                            </Dropdown>
                        </Col>
                    </Row>
                </span>
            )
        }
        // @ts-ignore
        this.dataItem.title = titleRender
        return this
    }

    setIsLeaf(isLeaf: boolean) {
        this.dataItem.isLeaf = isLeaf
        return this
    }

    setLoadData = (
        loadData: (dataRef: TreeDataItem) => TreeDataItem[] | Promise<TreeDataItem[]>
    ) => {
        this.dataItem.loadData = function() {
            return new Promise<void>((resolve, reject) => {
                const fetch = async () => await loadData(this)
                fetch().then((data) => {
                    this.children = data || []
                    resolve()
                })
            })
        }
        return this
    }

    setCheckable = (checkable: boolean = true) => {
        this.dataItem.checkable = checkable
        return this
    }
}

import { defineComponent, onMounted, reactive } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'

const FullScreen = defineComponent({
    setup() {
        const state = reactive({
            fullscreenState: false
        })

        onMounted(() => {
            document.onfullscreenchange = () => {
                state.fullscreenState = !!document.fullscreenElement
            }
        })

        return () =>
            state.fullscreenState ? (
                <Tooltip title="退出全屏">
                    <FullscreenExitOutlined />
                </Tooltip>
            ) : (
                <Tooltip title="全屏">
                    <FullscreenOutlined />
                </Tooltip>
            )
    }
})

export default FullScreen

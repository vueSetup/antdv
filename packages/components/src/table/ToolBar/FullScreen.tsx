import { defineComponent, ref, onMounted } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';

const FullScreen = defineComponent({
    setup() {
        const fullscreenState = ref<boolean>(false)

        onMounted(() => {
            document.onfullscreenchange = () => {
                if (document.fullscreenElement) {
                    fullscreenState.value = true
                } else {
                    fullscreenState.value = false
                }
            }
        })

        return { fullscreenState }
    },
    render() {
        return this.fullscreenState ?
            (
                <Tooltip title='退出全屏'>
                    <FullscreenExitOutlined />
                </Tooltip>
            ) : (
                <Tooltip title='全屏'>
                    <FullscreenOutlined />
                </Tooltip>
            )
    }
})

export default FullScreen
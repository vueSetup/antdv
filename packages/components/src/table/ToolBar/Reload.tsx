import { FunctionalComponent } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'

const Reload: FunctionalComponent = () => (
    <Tooltip title="刷新">
        <ReloadOutlined />
    </Tooltip>
)

export default Reload

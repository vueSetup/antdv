import { defineComponent, PropType } from 'vue';
import { Func, ExpressionFunc, Fields, Funcs } from './types';
import { Config } from './config';
import Expression from './Expression';
// import PopOverContainer from '../PopOverContainer';
// import ListRadios from '../ListRadios';
// import ResultBox from '../ResultBox';
import { Select } from 'ant-design-vue'
import { findTree, noop } from './utils/helper';

// export interface ConditionFuncProps {
//   value: ExpressionFunc;
//   onChange: (value: ExpressionFunc) => void;
//   config: Config;
//   fields?: Field[];
//   funcs?: Funcs;
//   allowedTypes?: Array<'value' | 'field' | 'func' | 'formula'>;
// }

const ConditionFuncProps = {
  disabled: Boolean,
  config: Object as PropType<Config>,
  fields: Array as PropType<Fields>,
  funcs: Array as PropType<Funcs>,
  allowedTypes: Array as PropType<Array<'value' | 'field' | 'func' | 'formula'>>,
  fieldClassName: String,
  value: Object as PropType<ExpressionFunc>,
  onChange: Function as PropType<(value: ExpressionFunc) => void>,
}

// const option2value = (item: Func) => item.type;

export const ConditionFunc = defineComponent({
  props: ConditionFuncProps,
  setup(props) {
    const handleFuncChange = (type: string) => {
      const value = { ...props.value };
      value.func = type;
      props.onChange(value);
    }

    const handleArgChange = (arg: any, index: number) => {
      const value = { ...props.value };
      value.args = Array.isArray(value.args) ? value.args.concat() : [];
      value.args.splice(index, 1, arg);
      props.onChange(value);
    }

    return {
      handleFuncChange,
      handleArgChange,
    }
  },
  render() {
    const { fields, value, fieldClassName, funcs, config, disabled } = this.$props;

    const func = value
      ? findTree(funcs!, item => (item as Func).type === value.func)
      : null;

    const renderFunc = (func: Func) => (
      <div class="CBFunc-args">
        {Array.isArray(func.args) && func.args.length ? (
          <div>
            {func.args.map((item, index) => (
              <Expression
                config={config}
                key={index}
                index={index}
                fields={fields}
                value={value?.args[index]}
                valueField={{ type: item.type } as any}
                onChange={this.handleArgChange}
                funcs={funcs}
                // allowedTypes={allowedTypes}
                disabled={disabled}
              />
            ))}
          </div>
        ) : null}
      </div>
    )

    return (
      <div class="CBFunc">
        {/* <PopOverContainer
          popOverRender={({ onClose }) => (
            <ListRadios
              onClick={onClose}
              showRadio={false}
              options={funcs!}
              value={(func as Func)?.type}
              option2value={option2value}
              onChange={this.handleFuncChange}
            />
          )}
        >
          {({ onClick, ref, isOpened }) => (
            <div className={cx('CBFunc-select')}>
              <ResultBox
                className={cx(
                  'CBGroup-fieldInput',
                  isOpened ? 'is-active' : ''
                )}
                ref={ref}
                allowInput={false}
                result={func?.label}
                onResultChange={noop}
                onResultClick={onClick}
                placeholder="请选择字段"
              >
                <span className={cx('CBGroup-fieldCaret')}>
                  <Icon icon="caret" className="icon" />
                </span>
              </ResultBox>
            </div>
          )}
        </PopOverContainer> */}
        <Select
          placeholder="请选择字段"
          options={funcs}
          value={(func as Func)?.type}
          onChange={this.handleFuncChange}
          disabled={disabled}
          class={fieldClassName}
        />
        {func ? renderFunc(func as Func) : <span class='CBFunc-error'>方法未定义</span>}
      </div>
    )
  }
})

export default ConditionFunc;

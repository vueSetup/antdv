import { defineComponent, PropType } from 'vue';
import {
  Fields,
  ConditionRule,
  ConditionGroupValue,
  Funcs,
  ExpressionFunc,
  Func,
  Field,
  FieldSimple,
  ExpressionField,
  OperatorType,
  ExpressionComplex,
  FuncGroup
} from './types';
import { Config, OperationMap } from './config';
import Expression from './Expression';
// import PopOverContainer from '../PopOverContainer';
// import ListRadios from '../ListRadios';
// import ResultBox from '../ResultBox';
// import {
//   RetweetOutlined
// } from '@ant-design/icons-vue';
import { Select } from 'ant-design-vue'
import { findTree, noop } from './utils/helper';


const option2value = (item: any) => item.value;

// export interface ConditionItemProps {
//   config: Config;
//   fields: Fields;
//   funcs?: Funcs;
//   index?: number;
//   value: ConditionRule;
//   data?: any;
//   onChange: (value: ConditionRule, index?: number) => void;
// }

const ConditionItemProps = {
  config: Object as PropType<Config>,
  fields: Array as PropType<Fields>,
  funcs: Array as PropType<Funcs>,
  index: Number,
  data: Object,
  disabled: Boolean,
  value: Object as PropType<ConditionRule>,
  onChange: Function as PropType<(value: ConditionRule, index?: number) => void>,
  fieldClassName: String
}

export const ConditionItem = defineComponent({
  props: ConditionItemProps,
  setup(props) {
    const handleLeftFieldSelect = (field: any) => {
      const value = { ...props.value };
      const onChange = props.onChange;
      value.left = field;
      onChange(value, props.index);
    }

    const handleLeftInputTypeChange = (type: 'func' | 'field') => {
      const value = { ...props.value };
      const onChange = props.onChange;

      if (type === 'func') {
        value.left = { type: 'func' };
      } else {
        value.left = '';
      }

      onChange(value, props.index);
    }

    const handleLeftChange = (leftValue: any) => {
      const value = {
        ...props.value,
        left: leftValue,
        op: undefined,
        right: undefined
      };
      const onChange = props.onChange;

      onChange(value, props.index);
    }

    const handleOperatorChange = (op: OperatorType) => {
      const value = { ...props.value, op: op, right: undefined };
      props.onChange(value, props.index);
    }

    const handleRightChange = (rightValue: any) => {
      const value = { ...props.value, right: rightValue };
      const onChange = props.onChange;

      onChange(value, props.index);
    }

    const handleRightSubChange = (index: number, rightValue: any) => {
      const origin = Array.isArray(props.value?.right)
        ? props.value.right.concat()
        : [];

      origin[index] = rightValue;
      const value = { ...props.value, right: origin };
      const onChange = props.onChange;

      onChange(value, props.index);
    }

    return {
      handleLeftFieldSelect,
      handleLeftInputTypeChange,
      handleLeftChange,
      handleOperatorChange,
      handleRightChange,
      handleRightSubChange
    }
  },
  render() {
    const renderLeft = () => {
      const { value, fields, funcs, config, disabled, fieldClassName } = this.$props;

      return (
        <Expression
          config={config}
          funcs={funcs}
          fieldClassName={fieldClassName}
          value={value.left}
          onChange={this.handleLeftChange}
          fields={fields}
          disabled={disabled}
          allowedTypes={
            ['field', 'func'].filter(
              type => type === 'field' || type === 'func'
            ) as any
          }
        />
      );
    }

    const renderOperator = () => {
      const { funcs, config, fields, value, disabled } = this.$props;
      const left = value?.left;
      let operators: Array<string> = [];

      if ((left as ExpressionFunc)?.type === 'func') {
        const func: Func = findTree(
          funcs as Array<Func>,
          (i: Func) => i.type === (left as ExpressionFunc).func
        ) as Func;

        if (func) {
          operators = config.types[func.returnType]?.operators;
        }
      } else if ((left as ExpressionField)?.type === 'field') {
        const field: FieldSimple = findTree(
          fields as Array<FieldSimple>,
          (i: FieldSimple) => i.name === (left as ExpressionField).field
        ) as FieldSimple;

        if (field) {
          operators = field.operators || config.types[field.type]?.operators;
        }
      }

      if (Array.isArray(operators) && operators.length) {
        return (
          // <PopOverContainer
          //   popOverRender={({ onClose }) => (
          //     <ListRadios
          //       onClick={onClose}
          //       option2value={option2value}
          //       onChange={this.handleOperatorChange}
          //       options={operators.map(operator => ({
          //         label: OperationMap[operator as keyof typeof OperationMap],
          //         value: operator
          //       }))}
          //       value={value.op}
          //       showRadio={false}
          //     />
          //   )}
          // >
          //   {({ onClick, isOpened, ref }) => (
          //     <div className={cx('CBGroup-operator')}>
          //       <ResultBox
          //         className={cx(
          //           'CBGroup-operatorInput',
          //           isOpened ? 'is-active' : ''
          //         )}
          //         ref={ref}
          //         allowInput={false}
          //         result={OperationMap[value?.op as keyof typeof OperationMap]}
          //         onResultChange={noop}
          //         onResultClick={onClick}
          //         placeholder="请选择操作"
          //       >
          //         <span className={cx('CBGroup-operatorCaret')}>
          //           <Icon icon="caret" className="icon" />
          //         </span>
          //       </ResultBox>
          //     </div>
          //   )}
          // </PopOverContainer>
          <Select
            disabled={disabled}
            placeholder="请选择操作"
            options={operators.map(operator => ({
              label: OperationMap[operator as keyof typeof OperationMap],
              value: operator
            }))}
            value={value.op}
            onChange={this.handleOperatorChange}></Select>
        );
      }

      return null;
    }

    const renderRight = () => {
      const { value, funcs, fields } = this.$props;

      if (!value?.op) {
        return null;
      }

      const left = value?.left;
      let leftType = '';

      if ((left as ExpressionFunc)?.type === 'func') {
        const func: Func = findTree(
          funcs as Array<Func>,
          (i: Func) => i.type === (left as ExpressionFunc).func
        ) as Func;

        if (func) {
          leftType = func.returnType;
        }
      } else if ((left as ExpressionField)?.type === 'field') {
        const field: FieldSimple = findTree(
          fields as Array<FieldSimple>,
          (i: FieldSimple) => i.name === (left as ExpressionField).field
        ) as FieldSimple;

        if (field) {
          leftType = field.type;
        }
      }

      if (leftType) {
        return renderRightWidgets(leftType, value.op!);
      }

      return null;
    }

    const renderRightWidgets = (type: string, op: OperatorType) => {
      const { funcs, value, data, fields, config } = this.$props;
      let field = {
        ...config.types[type],
        type
      } as FieldSimple;

      if ((value?.left as ExpressionField)?.type === 'field') {
        const leftField: FieldSimple = findTree(
          fields as Array<FieldSimple>,
          (i: FieldSimple) => i.name === (value?.left as ExpressionField).field
        ) as FieldSimple;

        if (leftField) {
          field = {
            ...field,
            ...leftField
          };
        }
      }

      if (op === 'is_empty' || op === 'is_not_empty') {
        return null;
      } else if (op === 'between' || op === 'not_between') {
        return (
          <>
            <Expression
              config={config}
              funcs={funcs}
              valueField={field}
              value={(value.right as Array<ExpressionComplex>)?.[0]}
              data={data}
              onChange={this.handleRightSubChange.bind(this, 0)}
              fields={fields}
              allowedTypes={
                field?.valueTypes ||
                config.valueTypes || ['value', 'field', 'func', 'formula']
              }
            />

            <span class="CBSeprator">~</span>

            <Expression
              config={config}
              funcs={funcs}
              valueField={field}
              value={(value.right as Array<ExpressionComplex>)?.[1]}
              data={data}
              onChange={this.handleRightSubChange.bind(this, 1)}
              fields={fields}
              allowedTypes={
                field?.valueTypes ||
                config.valueTypes || ['value', 'field', 'func', 'formula']
              }
            />
          </>
        );
      }

      return (
        <Expression
          config={config}
          op={op}
          funcs={funcs}
          valueField={field}
          value={value.right}
          data={data}
          onChange={this.handleRightChange}
          fields={fields}
          allowedTypes={
            field?.valueTypes ||
            config.valueTypes || ['value', 'field', 'func', 'formula']
          }
        />
      );
    }

    return (
      <div class='CBItem'>
        {renderLeft()}
        {renderOperator()}
        {renderRight()}
      </div>
    );
  }
})

export default ConditionItem;

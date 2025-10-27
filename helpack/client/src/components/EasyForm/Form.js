/* eslint-disable react/prop-types,react/display-name */
/** @typedef {import('./_form').FieldInputGroup} FieldInputGroup*/
/** @typedef {import('./_form').FieldInput} FieldInput*/
/** @typedef {import('concent').SettingsType} SettingsType*/
/** @typedef {import('types/store').CtxDeS } CtxDeS*/
import { Button, Form, Radio } from 'antd';
import { useConcent } from 'concent';
import PropTypes from 'prop-types';
import React from 'react';
import Blank from './Blank';
import * as util from './_util';

const { Item: FormItem } = Form;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const { getFieldTypeMaker } = util;

const cu = {
  formItemLayout: (n) => (n.formLayout === 'horizontal' ? { labelCol: { span: 4 }, wrapperCol: { span: 14 } } : null),
  buttonItemLayout: (n) => (n.formLayout === 'horizontal' ? { wrapperCol: { span: 14, offset: 4 } } : null),
};

const setup = (/** @type {import('types/store').CtxDeS<{}, {}, {}, {}, [{form: import('antd/lib/form').FormInstance}]>} */ ctx) => {
  ctx.initState({ formLayout: ctx.props.layout || 'horizontal', loading: false });

  ctx.computed(cu);

  ctx.on('cancelFormBtnLoading', () => {
    ctx.setState({ loading: false });
  });

  ctx.on('fillFormValues', (formValues) => {
    ctx.extra.form.setFieldsValue(formValues);
  });
  window.top._form = ctx.extra.form;

  ctx.effectProps(
    () => {
      const { fillValues } = ctx.props;
      if (fillValues) {
        const fillValuesCopy = { ...fillValues };
        ctx.extra.form.setFieldsValue(fillValuesCopy);
      }
    },
    ['fillValues'],
    { immediate: true },
  );

  // 处理表单布局改变的回调
  const onLayoutChange = (e) => {
    ctx.setState({ formLayout: e.target.value });
  };

  let renderLayoutControl = () => '';
  if (ctx.props.dynamicLayout) {
    renderLayoutControl = () => (
      // 刻意不写name，让该FormItem失去包裹它的Form的数据双向绑定关系
      <FormItem label={ctx.props.layoutFieldLabel || 'Form Layout'} style={{ marginBottom: '10px' }}>
        <RadioGroup value={ctx.state.formLayout} onChange={onLayoutChange}>
          <RadioButton value="horizontal">Horizontal</RadioButton>
          <RadioButton value="vertical">Vertical</RadioButton>
          <RadioButton value="inline">Inline</RadioButton>
        </RadioGroup>
      </FormItem>
    );
  }

  const onValuesChange = (changed) => {
    if (ctx.props.onValuesChange) {
      ctx.props.onValuesChange(changed, ctx.extra.form);
    }
  };

  const onFinish = (values) => {
    if (ctx.props.onFinish) {
      ctx.props.onFinish(values);
      ctx.setState({ loading: true });
    }
  };

  const UIFields = ctx.props.fields.map((f) => {
    const { type, options } = f;
    const makeFn = getFieldTypeMaker(type);
    return makeFn(options);
  });

  // 组装重置按钮
  const { resetBtn } = ctx.props;
  let UIResetBtn = '';
  if (resetBtn !== undefined) {
    const onReset = () => ctx.extra.form.resetFields();
    const btnLabel = typeof resetBtn !== 'string' ? 'Reset' : resetBtn;
    UIResetBtn = (
      <Button htmlType="button" onClick={onReset}>
        {btnLabel}
      </Button>
    );
  }

  // 组装填充按钮
  let UIFillBtn = '';
  const { fillBtn, fillValues } = ctx.props;
  if (fillBtn !== undefined) {
    const onFill = () => {
      if (!fillValues) {
        return alert('请设置欲填充的默认值');
      }
      ctx.extra.form.setFieldsValue(fillValues);
    };
    const fillBtnLabel = typeof fillBtn !== 'string' ? 'Fill form' : fillBtn;
    UIFillBtn = (
      <Button htmlType="button" onClick={onFill}>
        {fillBtnLabel}
      </Button>
    );
  }

  return {
    renderLayoutControl,
    UIFields,
    UIResetBtn,
    UIFillBtn,
    onValuesChange,
    onFinish,
  };
};

/** @typedef {import('types/store').CtxDeS<{},
 * {formLayout:string},
 * import('concent').SettingsType<typeof setup>,
 * import('concent').ComputedValType<typeof cu>
 * >} Ctx */

/**
 * @param {object} props
 * @param {Array<FieldInput | FieldInputGroup>} props.fields - 表单字段描述对象
 * @param {(changedValues:any, setFieldsValue:(values:Record<string, any>)=>void)=>void} [props.onValuesChange]
 * - 字段值改变时的回调
 * @param {(values:any)=>void} [props.onFinish] - 提交表单时的回调
 * @param {'horizontal'|'vertical'|'inline'} [props.layout='horizontal'] - 布局模式(水平、垂直、行内)
 * @param {boolean} [props.dynamicLayout=false] - 是否动态布局
 * @param {string} [props.layoutFieldLabel='Form Layout'] - 布局字段文案
 * @param {string} [props.submitBtnLabel='Submit'] - 提交按钮的文案
 * @param {boolean | string} [props.resetBtn=false] - 是否需要重置按钮，传递string表示重新默认文案
 * @param {boolean | string} [props.fillBtn=false] - 是否需要填充表单按钮，传递string表示重新默认文案
 * @param {boolean} [props.showSelfBtn=true] - 是否展示内置按钮，默认true
 * @param {object} [props.fillValues] - 设置需要填充的默认值
 * @param {Array<React.ReactElement>} [props.extraBtns] - 额外的按钮
 */
const EasyForm = (props) => {
  const [form] = Form.useForm();

  /** @type Ctx */
  const ctx = useConcent({ setup, props, extra: { form } });
  const {
    state: { formLayout, loading },
    refComputed: { formItemLayout, buttonItemLayout },
    settings: { renderLayoutControl, UIFields, UIResetBtn, UIFillBtn, onValuesChange, onFinish },
  } = ctx;
  const UIExtraBtns = props.extraBtns || '';
  const initialValues = { layout: formLayout };
  props.fields.forEach((f) => {
    if (Object.prototype.hasOwnProperty.call(f.options, 'value')) {
      initialValues[f.options.name] = f.options.value;
    }
  });
  const { showSelfBtn = true } = props;

  return (
    <div>
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        onFinish={onFinish}
        initialValues={initialValues}
        onValuesChange={onValuesChange}
      >
        {renderLayoutControl()}
        {UIFields}
        <Form.Item {...buttonItemLayout}>
          {UIExtraBtns}
          {showSelfBtn && (
            <div style={{ textAlign: 'center', paddingTop: '12px' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {props.submitBtnLabel || 'Submit'}
              </Button>
              {UIResetBtn ? (
                <>
                  <Blank />
                  {UIResetBtn}
                </>
              ) : (
                ''
              )}
              {UIFillBtn ? (
                <>
                  <Blank />
                  {UIFillBtn}
                </>
              ) : (
                ''
              )}
            </div>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

EasyForm.propTypes = {
  fields: PropTypes.array.isRequired,
};

export default React.memo(EasyForm);

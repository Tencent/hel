/* eslint-disable react/prop-types,no-underscore-dangle */
import { Form, Input, InputNumber, Radio, Select, Switch } from 'antd';
import React from 'react';
import * as helUtil from 'utils/hel';

const { Option } = Select;

let fieldKey = 1;
// getUsableFieldKey
function fKey() {
  fieldKey += 1;
  return fieldKey;
}

function ensureOptions(options) {
  let _options = options;
  if (typeof options[0] === 'string') {
    _options = options.map((v) => ({ value: v, label: v }));
  }
  return _options;
}

function makeOneFieldMultiInputView(items, fieldName) {
  const view = items.map((item, idx) => {
    const { type, name: itemName, style = {}, placeHolder, ...rest } = item;
    let itemView = '';
    const rules = item.rules || [];

    if (type === 'select') {
      const options = ensureOptions(item.options);
      itemView = (
        <Select placeholder={item.placeHolder} getPopupContainer={helUtil.getAppBodyContainer}>
          {options.map((d, idx) => (
            <Option key={idx} value={d.value}>
              {d.label}
            </Option>
          ))}
        </Select>
      );
    } else if (type === 'input') {
      itemView = <Input style={style} {...rest} placeholder={placeHolder} />;
    } else if (type === 'inputNumber') {
      itemView = <InputNumber {...rest} />;
    } else if (type === 'customize') {
      itemView = item.render(itemName, fieldName);
    } else {
      throw new Error(`not implemented type[${type}]`);
    }

    const namePath = fieldName ? [fieldName, itemName] : itemName;
    return (
      <Form.Item key={idx} name={namePath} noStyle rules={rules}>
        {itemView}
      </Form.Item>
    );
  });

  return view;
}

export function makeGroupButtonView({ name, label, initValue = '', options = [], render, ...rest }) {
  const _options = ensureOptions(options);
  const _initValue = initValue || _options[0];

  let view;
  if (render) {
    view = render({ initValue: _initValue, options: _options });
  } else {
    view = (
      <Radio.Group value={_initValue} {...rest}>
        {_options.map((v, idx) => (
          <Radio.Button key={idx} value={v.value}>
            {v.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    );
  }

  return (
    <Form.Item key={fKey()} label={label} name={name} style={{ marginBottom: '10px' }}>
      {view}
    </Form.Item>
  );
}

export function makeRadioGroupView({ name, label, initValue = '', options = [], render, rules = [], ...rest }) {
  const _options = ensureOptions(options);
  const _initValue = initValue || _options[0];

  let view;
  if (render) {
    view = render({ initValue: _initValue, options: _options });
  } else {
    view = <Radio.Group options={options} value={_initValue} {...rest} />;
  }

  return (
    <Form.Item key={fKey()} label={label} name={name} rules={rules} style={{ marginBottom: '10px' }}>
      {view}
    </Form.Item>
  );
}

export function makeInputView({ name, label, placeholder = '', initValue = '', rules = [], ...rest }) {
  return (
    <Form.Item key={fKey()} label={label} name={name} rules={rules} style={{ marginBottom: '10px' }}>
      <Input placeholder={placeholder} value={initValue} {...rest} />
    </Form.Item>
  );
}

export function makeSelectView({ name, label, options = [], placeholder = '', initValue = '', rules = [], ...rest }) {
  return (
    <Form.Item key={fKey()} label={label} name={name} rules={rules} style={{ marginBottom: '10px' }}>
      <Select placeholder={placeholder} value={initValue} {...rest} getPopupContainer={helUtil.getAppBodyContainer}>
        {options.map((d, idx) => (
          <Option key={idx} value={d.value}>
            {d.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
}

/**
 * 字段对应的值是一个对象，即该对象里多个key对应着同一个表单字段
 * 需要多个输入区域来作为这个对象的数据输入源
 * @see https://ant.design/components/form-cn/?#components-form-demo-complex-form-control
 * @param {object} option - InputGroupView可选配置
 * @param {Array} [option.items] - 形如: items = [
 *  {
 *    type: 'select', name: 'province', placeHolder:'select province', rules:[],
 *    options: [{label:'axx', value:'a'}, {label:'bxx', value:'b'}], // or ['a', 'b']
 *    style: {...},
 *  },
 *  {
 *    type: 'input', name: 'street', placeHolder:'input street', rules:[],
 *    style: {...},
 *  },
 *  {
 *     type: 'inputNumber', name: 'age'
 *  },
 *  {
 *     type: 'customize', name: 'age', render: (name, itemName)=> ReactElement,
 *  },
 * ]
 * @return {React.FC}
 */
export function makeInputGroupView({ name, label, items = [] }) {
  const formItemsView = makeOneFieldMultiInputView(items, name);

  return (
    <Form.Item key={fKey()} label={label} style={{ marginBottom: '10px' }}>
      <Input.Group compact>{formItemsView}</Input.Group>
    </Form.Item>
  );
}

/**
 * 一个字段视图里有多个输入域，每一个输入域单独对应着一个表单字段
 */
export function makeInputMultiView({ label, items = [] }) {
  const formItemsView = makeOneFieldMultiInputView(items);
  return (
    <Form.Item key={fKey()} label={label} style={{ marginBottom: '10px' }}>
      {formItemsView}
    </Form.Item>
  );
}

export function makeInputNumberView({ name, label, ...rest }) {
  return (
    <Form.Item key={fKey()} name={name} label={label} style={{ marginBottom: '10px' }}>
      <InputNumber {...rest} />
    </Form.Item>
  );
}

export function makeSwitchView({ name, label, ...rest }) {
  return (
    <Form.Item key={fKey()} name={name} label={label} style={{ marginBottom: '10px' }}>
      <Switch {...rest} />
    </Form.Item>
  );
}

export function makeCustomizeView({ render, ...rest }) {
  const { name, label } = rest;
  const view = render ? render(rest) : <h>need render</h>;

  return (
    <Form.Item key={fKey()} name={name} label={label} style={{ marginBottom: '10px' }}>
      {view}
    </Form.Item>
  );
}

export const fieldTypeMakerMap = {
  input: makeInputView,
  switch: makeSwitchView,
  select: makeSelectView,
  inputGroup: makeInputGroupView,
  inputMulti: makeInputMultiView,
  inputNumber: makeInputNumberView,
  groupButton: makeGroupButtonView,
  radioGroup: makeRadioGroupView,
  customize: makeCustomizeView,
};

export function getFieldTypeMaker(type) {
  const maker = fieldTypeMakerMap[type];
  if (!maker) throw new Error(`not implement field type[${type}]`);
  return maker;
}

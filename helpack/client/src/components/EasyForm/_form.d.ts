type RuleRequired = { required: boolean, message: string };
type Rule = RuleRequired; // may union other rule
type ObjectOption = { label: string, value: string };

//-----------------------------------------------------------------
//  FieldInput type
//_________________________________________________________________

export type FieldInput = {
  type: 'input',
  options: {
    name: string, label: string, placeholder?: string, initValue?: string, rules?: Rule[]
  }
}


//-----------------------------------------------------------------
//  FieldInputGroup type
//_________________________________________________________________
type InputGroupSelectItem = {
  type: 'select', name: string, placeholder?: string,
  rules?: Rule[], style: { [key: string]: any },
  options: Array<ObjectOption> | Array<string>,
}
type InputGroupInputItem = {
  type: 'input', name: string, placeholder?: string,
  rules?: Rule[], style: { [key: string]: any },
}
type InputGroupInputNumberItem = {
  type: 'inputNumber', name: string,
}
type InputGroupCustomizeItem = {
  type: 'customize', name: string, render: (name: string, itemName: string) => React.ReactElement;
}
type InputGroupItem = InputGroupSelectItem | InputGroupInputItem | InputGroupInputNumberItem | InputGroupCustomizeItem;
/**
 *  { 
 *    type: 'select', name: 'province', placeholder:'select province', rules:[],
 *    options: [{label:'axx', value:'a'}, {label:'bxx', value:'b'}], // or ['a', 'b']
 *    style: {...},
 *  },
 *  { 
 *    type: 'input', name: 'street', placeholder:'input street', rules:[],
 *    style: {...},
 *  },
 *  {
 *     type: 'inputNumber', name: 'age'
 *  },
 *  {
 *     type: 'customize', name: 'age', render: (name, itemName)=> ReactElement,
 *  },
 */
export type FieldInputGroup = {
  type: 'inputGroup',
  options: {
    name: string, label: string, items: InputGroupItem[]
  }
}
import { autoinject, containerless, bindable, bindingMode } from 'aurelia-framework';
import { Tasklist } from '../../../utils/models/tasklist'

@containerless
@autoinject()
export class TasklistElementCustomElement {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public tasklist!: Tasklist;
  // @bindable({ defaultBindingMode: bindingMode.twoWay }) public tasklist!: Tasklist;
  
  constructor(
  ) {
  }

  activate() {
  }

  created() {
  }

  
}

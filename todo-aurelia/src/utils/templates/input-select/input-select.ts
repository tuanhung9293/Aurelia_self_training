import { containerless, bindable, bindingMode } from 'aurelia-framework';

export interface IProduct {
  id: number;
  value: number;
}

@containerless
export class InputSelectCustomElement {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public inputSelected!: Object | string;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public options!: IProduct[];
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public selectChange!: () => void;
}
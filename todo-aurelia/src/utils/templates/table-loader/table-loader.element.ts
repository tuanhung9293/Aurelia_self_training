import { containerless, bindable, bindingMode } from 'aurelia-framework';

@containerless
export class TableLoaderCustomElement {
    @bindable({ defaultBindingMode: bindingMode.oneWay }) public percent!: number;
}

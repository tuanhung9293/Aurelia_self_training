import { containerless, bindable, bindingMode } from 'aurelia-framework';
import { RenderedError } from 'aurelia-validation';

@containerless
export class InputFieldCustomElement {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public inputId!: string;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public type!: string;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public label!: string;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public inputValue!: string;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public inputPlaceholder?: string;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public validateOnChange?: Function;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public validateOnBlur?: Function;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) public errors?: RenderedError[];

  public inputValid: boolean = false;

  public onChange(): void {
    if (this.validateOnChange) {
      this.validateOnChange();
      this.checkInputValidity();
    }
  }

  public onBlur(): void {
    if (this.validateOnBlur) {
      this.validateOnBlur();
      this.checkInputValidity();
    }
  }

  private checkInputValidity(): void {
    if (this.errors && this.errors.length === 0 && this.inputValue !== '') {
      this.inputValid = true;
    }
  }
}

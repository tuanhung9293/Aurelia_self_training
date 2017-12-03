import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Notify {
  message: object;

  constructor(private controller: DialogController) {
  }

  activate(model) {
    this.message = model;
  }
}

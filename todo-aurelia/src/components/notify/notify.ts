import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@autoinject()
export class Notify {
  message: object;

  constructor(private controller: DialogController) {
  }

  activate(model) {
    this.message = model;
  }
}

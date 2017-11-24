import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class RatingDialog {

  heading = 'Rate me...';
  maxRating = 5;

  constructor(controller) {
    this.controller = controller;
  }

  activate(rating = 1) {
    this.rating = rating;
  }

  rate(event) {
    if(event.target.dataset.rate) {
      this.rating = event.target.dataset.rate;
    }
  }
}

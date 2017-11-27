import {inject} from 'aurelia-framework';
import {User, PasswordChange} from './models';
import {HttpClient} from 'aurelia-http-client';
import {AuthenService} from './authen.service';
import * as PRODUCT from './constants';

let defaultData = {'uid': {value: null}, 'client': {value: null}, 'access-token': {value: null}};
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || defaultData;

let httpClient = new HttpClient();

httpClient.configure(config => {
  config
    .withBaseUrl(PRODUCT.serverURL)
    .withHeader('Content-Type', 'application/json; charset=utf-8')
    .withHeader('Uid', currentUser['uid'].value)
    .withHeader('Client', currentUser['client'].value)
    .withHeader('Access-Token', currentUser['access-token'].value)
    .withInterceptor({
      request(message) {
        return message;
      },

      requestError(error) {
        throw error;
      },

      response(message) {
        return message;
      },

      responseError(error) {
        throw error;
      }
    });
});

@inject(AuthenService)
export class UserService {
  constructor(private authenService: AuthenService) {
  }

  createUser(user: User) {
    return httpClient.post(PRODUCT.userCreatePATH, user)
      .then(response => {
        return JSON.parse(response.response);
      })
      .catch((error) => console.log('got failure', error));
  }

  changePassword(changepassword: PasswordChange) {
    return httpClient.put(PRODUCT.userPasswordPATH, changepassword)
      .then(response => {
        return JSON.parse(response.response);
      })
      .catch((error) => console.log('got failure', error));
  }

  getUsers() {
    return httpClient.get(PRODUCT.getUsersPATH)
      .then(response => {
        return JSON.parse(response.response);
      })
      .catch((error) => console.log('got failure', error));
  }

  getCurrentUser() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser['uid'].value;
  }
}

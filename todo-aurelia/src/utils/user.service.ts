import {inject} from 'aurelia-framework';
import {User, PasswordChange} from './models';
import {HttpClient, json} from 'aurelia-fetch-client';
import {AuthenService} from './authen.service';
import * as PRODUCT from './constants';

let currentUser = JSON.parse(localStorage.getItem('currentUser'));

let headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Uid': 'tuantest1@gmail.com',
  'Client': 'y6_yWlNILBrklyKMmrI4rQ',
  'Access-Token': '1OGuHEwZ85_aBqil-NMTJQ'
};

let httpClient = new HttpClient();

httpClient.configure(config => {
  config
    .useStandardConfiguration()
    .withBaseUrl(PRODUCT.serverURL)
    .withDefaults({
      credentials: 'same-origin',
      headers: headers
    })
    .withInterceptor({
      request(request) {
        return request; // you can return a modified Request, or you can short-circuit the request by returning a Response
      },
      response(response) {
        return response; // you can return a modified Response
      }
    });
});

@inject(AuthenService)
export class UserService {
  constructor(private authenService: AuthenService) {
  }

  createUser(user: User) {
    return httpClient.fetch(PRODUCT.userCreatePATH, {
      method: 'post',
      body: json(user)
    })
      .then(response => response.json())
      .catch(() => console.log('got failure'));
  }

  changePassword(changepassword: PasswordChange) {
    return httpClient.fetch(PRODUCT.userPasswordPATH, {
        method: 'put',
        body: json(changepassword)
      }
    )
      .then(response => response.json())
      .catch(() => console.log('got failure'));
  }

  getUsers() {
    return httpClient.fetch(PRODUCT.getUsersPATH, {
        method: 'get'
      }
    )
      .then(response => response.json())
      .catch(() => console.log('got failure'));
  }

  getCurrentUser() {
    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // return currentUser.headers['Uid'];
    return 'tuantest1@gmail.com'
  }
}

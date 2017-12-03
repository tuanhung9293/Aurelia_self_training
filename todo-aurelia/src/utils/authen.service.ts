import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import * as PRODUCT from './constants';

@inject(HttpClient)
export class AuthenService {
  defaultData = {'uid': {value: null}, 'client': {value: null}, 'access-token': {value: null}};
  constructor(private httpClient: HttpClient) {
  }

  configHttpClient(uid, client, token) {
    this.httpClient.configure(config => {
      config
        .withBaseUrl(PRODUCT.serverURL)
        .withHeader('Content-Type', 'application/json; charset=utf-8')
        .withHeader('Uid', uid)
        .withHeader('Client', client)
        .withHeader('Access-Token', token)
    });
  }

  login(email: string, password: string) {
    return this.httpClient.post(PRODUCT.userSignInPATH, {email: email, password: password})
      .then((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response.headers.headers));
        localStorage.setItem('authenIsOk', 'true');
        return response;
      })
      .then(() => this.configHttpClient(this.getUserToken()['uid'].value, this.getUserToken()['client'].value, this.getUserToken()['access-token'].value))
      .catch(this.handleError);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authenIsOk');
    this.configHttpClient('', '', '');
  }

  extractData(res) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getUserToken() {
    let data = JSON.parse(localStorage.getItem('currentUser')) || this.defaultData;
    return data;
  }
}

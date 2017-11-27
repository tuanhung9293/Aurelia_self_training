import {HttpClient} from 'aurelia-http-client';
import * as PRODUCT from './constants';

let httpClient = new HttpClient();

httpClient.configure(config => {
  config
    .withBaseUrl(PRODUCT.serverURL)
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

export class AuthenService {
  constructor(public defaultData: any, public currentUser: any) {
    this.defaultData = {'uid': {value: null}, 'client': {value: null}, 'access-token': {value: null}};
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || this.defaultData;
  }

  login(email: string, password: string) {
    return httpClient.post(PRODUCT.userSignInPATH, {email: email, password: password})
      .then((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response.headers.headers));
        localStorage.setItem('authenIsOk', 'true');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return response;
      })
      .catch(this.handleError);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authenIsOk');
    // window.location.reload(true);
    this.currentUser = this.defaultData;
  }

  extractData(res: Response) {
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

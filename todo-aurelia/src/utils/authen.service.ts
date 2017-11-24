import {HttpClient, Response, json} from 'aurelia-fetch-client';
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
        console.log(`Requesting ${request.method} ${request.url}`);
        return request; // you can return a modified Request, or you can short-circuit the request by returning a Response
      },
      response(response) {
        console.log(JSON.stringify(response));
        return response; // you can return a modified Response
      }
    });
});

export class AuthenService {
  login(email: string, password: string) {
    return httpClient.fetch(PRODUCT.userSignInPATH, {
        method: 'post',
        body: json({email: email, password: password})
      }
    )
      .then((response: Response) => {
        return response;
        this.extractData(response);
      })
      .catch(this.handleError);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
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
}

import {HttpClient, Response, json} from 'aurelia-fetch-client';
import * as PRODUCT from '../constants';

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

export class TasklistService {

  getTasklists() {
    return httpClient.fetch(PRODUCT.tasklistsPATH)
      .then(response => {
        return response.json();
      })
      .catch(() => console.log('getTasklists got failure'));
  }

  getTasklist(tasklist_id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/`)
      .then((response) => {
          return response.json();
        })
      .catch(() => console.log('getTasklist got failure'));
  }

  getTasklistsAuthorized() {
    return httpClient.fetch(PRODUCT.tasklistsAuthorizedPATH)
      .then(
        response => {
          return response.json();
        })
      .catch(() => console.log('getTasklistsAuthorized got failure'));
  }

  getAuthorizedUsers(tasklist_id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/`, {
      method: 'get',
    })
      .then((response) => {
          return response.json();
        })
      .catch(() => console.log('got failure'));
  }

  createAuthorizedUser(tasklist_id: number, user_id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/`, {
      method: 'post',
      body: json({user_id: user_id}),
    })
      .then(
        response => {
          return response.json();
        })
      .catch(() => console.log('got failure'));
  }

  updateAuthorizedUser(tasklist_id: number, user_id: number, is_write: boolean) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/`, {
      method: 'put',
      body: json({user_id: user_id, is_write: is_write}),
    })
      .then(
        response => {
          return response.json();
        })
      .catch(() => console.log('got failure'));
  }

  deleteAuthorizedUser(tasklist_id: number, user_id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/`, {
      method: 'delete',
      body: json({user_id: user_id}),
    })
      .then(
        response => {
          return response.json();
        })
      .catch(() => console.log('got failure'));
  }

  createTasklist(tasklistName: string) {
    () => console.log('createTasklist', tasklistName)
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}`, {
      method: 'post',
      body: json({name: tasklistName}),
    })
      .then(
        response => {
          return response;
        })
      .catch(() => console.log('createTasklist got failure'));
  }

  deleteTasklist(id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${id}/`, {
      method: 'delete',
    })
      .then(
        response => {
          console.log(`delete tasklist ${id} success in service`);
          return response.json();
        })
      .catch(() => console.log('got failure'));
  }

  updateTasklist(tasklist_id: number, tasklist_name: string) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}`, {
      method: 'put',
      body: json({name: tasklist_name})
    })
      .then(
        response => {
          return response.json();
        })
      .catch(() => console.log('got failure'));
  }

  getTodos(tasklist_id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/`, {
      method: 'get',
    })
      .then(
        response => {
          return response.json();
        })
      .catch(() => console.log('got failure'));
  }

  addTodo(tasklist_id: number, name: string) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/`, {
      method: 'post',
      body: json({name: name})
    })
      .then(response => {
        return response.json();
      })
      .catch(() => console.log('got failure'));
  }

  updateTodo(tasklist_id: number, todo_id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/${todo_id}`, {
      method: 'put',
      body: json({done: true})
    })
      .then(response => {
        return response.json();
      })
      .catch(() => console.log('got failure'));
  }

  deleteTodo(tasklist_id: number, todo_id: number) {
    return httpClient.fetch(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/${todo_id}`, {
      method: 'delete',
    })
      .then(response => {
        return response.json();
      })
      .catch(() => console.log('got failure'));
  }

  extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}

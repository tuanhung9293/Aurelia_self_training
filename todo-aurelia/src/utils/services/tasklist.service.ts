import {inject} from 'aurelia-framework';
import {HttpClient, Response} from 'aurelia-http-client';
import * as PRODUCT from '../constants';
import {AuthenService} from '../authen.service';


@inject(AuthenService, HttpClient)
export class TasklistService {
  constructor(private authenService: AuthenService, private httpClient: HttpClient) {
  }

  getTasklists() {
    this.authenService.configHttpClient(
      this.authenService.getUserToken()['uid'].value,
      this.authenService.getUserToken()['client'].value,
      this.authenService.getUserToken()['access-token'].value);

    return this.httpClient.get(PRODUCT.tasklistsPATH)
      .then(response => {
        return JSON.parse(response.response);
      })
      .catch((error) => console.log('getTasklists got failure', error));
  }

  getTasklist(tasklist_id: number) {
    return this.httpClient.get(`${PRODUCT.tasklistsPATH}/${tasklist_id}/`)
      .then((response) => {
        return JSON.parse(response.response);
      })
      .catch(() => console.log('getTasklist got failure'));
  }

  getTasklistsAuthorized() {
    return this.httpClient.get(PRODUCT.tasklistsAuthorizedPATH)
      .then(
        response => {
          return JSON.parse(response.response);
        })
      .catch(() => console.log('getTasklistsAuthorized got failure'));
  }

  getAuthorizedUsers(tasklist_id: number) {
    return this.httpClient.get(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/`)
      .then((response) => {
        return JSON.parse(response.response);
      })
      .catch(() => console.log('got failure'));
  }

  createAuthorizedUser(tasklist_id: number, user_id: number) {
    return this.httpClient.post(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/`, {user_id: user_id})
      .then(
        response => {
          return JSON.parse(response.response);
        })
      .catch(() => console.log('got failure'));
  }

  updateAuthorizedUser(tasklist_id: number, user_id: number, is_write: boolean) {
    return this.httpClient.put(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/`, {
      user_id: user_id,
      is_write: is_write
    })
      .then(
        response => {
          return JSON.parse(response.response);
        })
      .catch(() => console.log('got failure'));
  }

  deleteAuthorizedUser(tasklist_id: number, user_id: number) {
    return this.httpClient.delete(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.sharePATH}/${user_id}`)
      .then(
        response => {
          return JSON.parse(response.response);
        })
      .catch(() => console.log('got failure'));
  }

  createTasklist(tasklistName: string) {
    return this.httpClient.post(`${PRODUCT.tasklistsPATH}`, {name: tasklistName})
      .then(
        response => {
          return JSON.parse(response.response);
        })
      .catch(() => console.log('createTasklist got failure'));
  }

  deleteTasklist(id: number) {
    return this.httpClient.delete(`${PRODUCT.tasklistsPATH}/${id}/`)
      .then(() => {
        console.log(`delete tasklist ${id} success in service`);
      })
      .catch((error) => console.log('got failure', error));
  }

  updateTasklist(tasklist_id: number, tasklist_name: string) {
    return this.httpClient.put(`${PRODUCT.tasklistsPATH}/${tasklist_id}`, {name: tasklist_name})
      .then(
        response => {
          return JSON.parse(response.response);
        })
      .catch(() => console.log('got failure'));
  }

  getTodos(tasklist_id: number) {
    return this.httpClient.get(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/`)
      .then(
        response => {
          return JSON.parse(response.response);
        })
      .catch(() => console.log('got failure'));
  }

  addTodo(tasklist_id: number, name: string) {
    return this.httpClient.post(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/`, {name: name})
      .then(response => {
        return JSON.parse(response.response);
      })
      .catch(() => console.log('got failure'));
  }

  updateTodo(tasklist_id: number, todo_id: number) {
    return this.httpClient.put(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/${todo_id}`, {done: true})
      .then(response => {
        return JSON.parse(response.response);
      })
      .catch(() => console.log('got failure'));
  }

  deleteTodo(tasklist_id: number, todo_id: number) {
    return this.httpClient.delete(`${PRODUCT.tasklistsPATH}/${tasklist_id}/${PRODUCT.todosPATH}/${todo_id}`)
      .then(response => {
        return JSON.parse(response.response);
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

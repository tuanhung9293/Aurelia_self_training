import {Router} from 'aurelia-router';

import {TasklistService} from '../../../utils/services/tasklist.service'
import {UserService} from '../../../utils/user.service'
import {User, Tasklist} from '../../../utils/models'

import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {TasklistDetail} from './tasklist-detail/tasklist-detail';
import {ShareTasklist} from './share-tasklist/share-tasklist';
import {EditTasklist} from './edit-tasklist/edit-tasklist';

import * as $ from 'jquery';

@inject(Router, DialogService, TasklistService, UserService)
export class TaskLists {
  data: Tasklist[] = [];
  users: User[];
  tasklistName: string = '';

  constructor(private router: Router,
              public dialogService: DialogService,
              public tasklistService: TasklistService,
              public userService: UserService) {
  }

  renderDatatable() {
    $('#example').dataTable({
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
  }

  created() {
    this.getTasklists();
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .then(data => this.users = data)
      .catch(() => console.log('getUsers fail'))
  }

  getTasklists() {
    this.tasklistService.getTasklists()
      .then(
        data => {
          this.data = data;
          console.log('Get tasklists success');
          this.data.forEach((item) => {
            item.owner = true;
            item.is_write = true;
            item.user = this.userService.getCurrentUser();
          });

          this.data.map((item, index) => {
            this.getAuthorizedUsers(item.id, index);
            this.getTodos(item.id, index);
          });

          this.getTasklistsAuthorized();
        }
      )
      .catch(() => console.log('getTasklists fail'))
  }

  getTodos(tasklist_id: number, data_id: number) {
    this.tasklistService.getTodos(tasklist_id)
      .then(
        data => {
          this.data[data_id].count = 0;
          data.forEach((item) => {
            if (!item.done) {
              this.data[data_id].count++
            }
          });
          this.data[data_id].done = data.length - this.data[data_id].count;
          console.log('Get todos success');
        })
      .catch(error => console.log('Get todos fail'))
  }

  getTasklistsAuthorized() {
    this.tasklistService.getTasklistsAuthorized()
      .then(
        data => {
          data.forEach((item) => {
            item.user = this.users.filter(h => h.id === item.user_id)[0].email;
          });
          this.data = this.data.concat(data);
          console.log('getTasklistsAuthorized success');
        }
      )
      .then(() => this.renderDatatable())
      .catch(() => console.log('getTasklistsAuthorized fail'))
  }

  getAuthorizedUsers(tasklist_id: number, data_id: number) {
    this.tasklistService.getAuthorizedUsers(tasklist_id)
      .then(
        data => {
          this.data[data_id].share = data.length;
          this.data[data_id].authorizedUsers = data;
          console.log('Get who authed tasklists success');
        }
      )
      .catch(() => console.log('getAuthorizedUsers fail'))
  }

  getTasklist(tasklist_id: number) {
    this.tasklistService.getTasklist(tasklist_id)
      .then(
        data => {
          this.data.filter(h => h.id === tasklist_id)[0].name = data.name;
          console.log(`Get tasklist ${tasklist_id} success`);
        }
      )
      .catch(() => console.log(`Get tasklist ${tasklist_id} fail`)
      )
  }

  createTasklist() {
    this.tasklistService.createTasklist(this.tasklistName)
      .then(
        response => {
          this.data.push(response);
          this.data[this.data.length - 1].is_write = true;
          this.data[this.data.length - 1].owner = true;
          this.data[this.data.length - 1].share = 0;
          this.data[this.data.length - 1].count = 0;
          this.data[this.data.length - 1].done = 0;
          this.data[this.data.length - 1].user = this.userService.getCurrentUser();
          this.data[this.data.length - 1].authorizedUsers = [];
          console.log('Create tasklist success');
          this.tasklistName = '';
        }
      )
      .catch(() => console.log(`Create tasklist fail`))
  }

  deleteTasklist(id: number): void {
    this.tasklistService.deleteTasklist(id)
      .then(
        () => {
          this.data = this.data.filter(h => h.id !== id);
          alert(`Delete tasklist ${id} success`);
        }
      )
      .catch(() => {
        console.log(`Delete tasklist ${id} fail`);
        this.data = this.data.filter(h => h.id !== id);
      })
  }

  showDetail(item) {
    this.dialogService.open({viewModel: TasklistDetail, model: item})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          console.log('OK');
        } else {
          console.log('Cancel');
        }
        console.log(response.output);
      });
  }

  share(item) {
    this.dialogService.open({viewModel: ShareTasklist, model: item})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          console.log('OK');
        } else {
          console.log('Cancel');
        }
        console.log(response.output);
      });
  }

  edit(item) {
    this.dialogService.open({viewModel: EditTasklist, model: item})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          item.name = response.output;
          console.log('OK');
        } else {
          console.log('Cancel');
        }
        console.log(response.output);
      });
  }
}

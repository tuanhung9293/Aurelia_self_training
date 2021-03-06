import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {User, Authen, Tasklist} from '../../../../utils/models';
import {UserService} from '../../../../utils/user.service';
import {TasklistService} from '../../../../utils/services/tasklist.service';

@autoinject()
export class ShareTasklist {
  tasklist: Tasklist;
  authorizedUsers: Authen[];
  users: User[] = [];

  constructor(private controller: DialogController,
              private userService: UserService,
              private tasklistService: TasklistService) {
  }

  activate(tasklist) {
    this.tasklist = tasklist;
  }

  created() {
    this.getUsers();
    this.getAuthorizedUsers(this.tasklist.id);
  }

  getUsers() {
    this.userService.getUsers()
      .then(
        data => {
          this.users = data;
          console.log('Get users success');
          this.users = this.users.filter(h => h.email !== this.userService.getCurrentUser()[0]);
          if (this.authorizedUsers) {
            this.authorizedUsers.forEach((item) => {
              item.user_email = this.users.filter(h => h.id === item.user_id)[0].email;
              this.users = this.users.filter(h => h.id !== item.user_id);
            })
          }
        })
      .catch(error => console.log('Get users fail')
    )
  }

  getAuthorizedUsers(tasklist_id: number) {
    this.tasklistService.getAuthorizedUsers(tasklist_id)
      .then(
        data => {
          this.authorizedUsers = data;
          this.authorizedUsers.map( item => {
            item.user_email = this.users.filter(h => h.id === item.user_id)[0].email;
          });
          console.log(this.authorizedUsers, 'Get who authed tasklists success');
        }
      )
      .catch((error) => console.log('getAuthorizedUsers fail', error))
  }

  createAuthorizedUser(user_id: number) {
    this.tasklistService.createAuthorizedUser(this.tasklist.id, user_id)
      .then(
        data => {
          this.authorizedUsers.push(data);
          let email = this.users.filter(h => h.id === data.user_id)[0].email;
          this.authorizedUsers[this.authorizedUsers.length - 1].user_email = email;
          console.log(`Create Authen users success`);

          this.tasklist.share_count++;
          this.users = this.users.filter(h => h.id !== user_id);
        })
      .catch(error => console.log('Create Authen users fail')
    )
  }

  deleteAuthorizedUser(user_id: number) {
    this.tasklistService.deleteAuthorizedUser(this.tasklist.id, user_id)
      .then(
        data => {
          let email = this.authorizedUsers.filter(h => h.user_id === user_id)[0].user_email;
          this.users.push({id: user_id, email: email, password: ''});
          this.authorizedUsers = this.authorizedUsers.filter(h => h.user_id !== user_id);
          console.log(`Delete Authen users success`);

          this.tasklist.share_count--
        })
      .catch(error => console.log('Delete Authen users fail')
    )
  }

  updateAuthorizedUser(user_id: number) {
    let authen_user = this.authorizedUsers.filter(h => h.user_id === user_id)[0];
    this.tasklistService.updateAuthorizedUser(this.tasklist.id, user_id, !authen_user.is_write)
      .then(
        data => {
          console.log(authen_user);
          authen_user.is_write = data.is_write;
          console.log('Update Authen users success');
        })
      .catch(error => console.log('Update Authen users fail')
    )
  }
}

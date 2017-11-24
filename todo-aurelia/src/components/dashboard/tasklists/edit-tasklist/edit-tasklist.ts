import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {User, Tasklist} from '../../../../utils/models';
import {TasklistService} from '../../../../utils/services/tasklist.service';

const mockCurrentUser: User[] = [{id: 4, email: 'user4@gmail.com', password: ''}];

@inject(DialogController, TasklistService)
export class EditTasklist {
  tasklist: Tasklist;
  rename: string;

  constructor(private controller: DialogController,
              private tasklistService: TasklistService) {
  }

  activate(tasklist) {
    this.rename = tasklist.name;
    this.tasklist = tasklist;
  }

  updateTasklist(tasklist_name: string): void {
    this.tasklistService.updateTasklist(this.tasklist.id, tasklist_name)
      .then(() => console.log('Rename tasklist success'))
      .then(() => this.controller.ok(tasklist_name))
      .catch(() => {
        console.log('Rename tasklist fail');
      })
  }

  changeName(event) {
    if(event.target.dataset.name) {
      this.rename = event.target.dataset.name;
    }
  }

}

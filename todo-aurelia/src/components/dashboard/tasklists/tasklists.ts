import { TasklistService } from '../../../utils/services/tasklist.service'
import { UserService } from '../../../utils/user.service'
import { User, Tasklist, TableTitle } from '../../../utils/models'

import { autoinject, factory } from 'aurelia-framework';

@autoinject()
export class TaskLists {
  tasklists: Tasklist[] = [];
  public loading: boolean = false;
  public percentLoading: number = 5;

  public childViewModel;

  public rowNumberOptions: Array<number> = [5, 10, 15, 20];
  public tableTitles: TableTitle[] = [
    { id: 0, additionClass: "text-center", sortField: "id", displayText: "ID" },
    { id: 1, additionClass: "", sortField: "name", displayText: "List Name" },
    { id: 2, additionClass: "", sortField: "user", displayText: "User" },
    { id: 3, additionClass: "hidden-xs", sortField: "share_count", displayText: "Share" },
    { id: 4, additionClass: "hidden-xs", sortField: "todo_count", displayText: "Todo" },
    { id: 5, additionClass: "hidden-xs", sortField: "done_count", displayText: "Done" },
    { id: 6, additionClass: "hidden-xs", sortField: "", displayText: "Access" },
    { id: 7, additionClass: "text-center", sortField: "", displayText: "Actions" },
  ];

  users: User[];
  tasklistName: string = '';
  generalData: any = {
    allTasklistOwner: 0, userShare: 0, allTodo:0, allDone:0
  };

  private increase: number = -1;

  constructor(
    public tasklistService: TasklistService,
    public userService: UserService
  ) {
  }

  created() {
    this.getTasklists();
    this.getUsers();
  }

  public async getUsers() {
    const users = await this.userService.getUsers();
    this.users = users;
  }

  private setTasklists(tasklist) {
    this.tasklists = this.tasklists.concat(tasklist);
    this.generalData.allTasklistOwner = tasklist.length;
    this.tasklists.forEach((item) => {
      this.generalData.allTodo += item.todo_count;
      this.generalData.userShare += item.share_count;
      this.generalData.allDone += item.done_count;
      item.owner = true;
      item.is_write = true;
      item.access = 'Full Access';
      item.user = this.userService.getCurrentUser();
    });
  }

  private setTasklistsAuthorized(tasklists) {
    tasklists.forEach((item) => {
      item.user = this.users.filter(h => h.id === item.user_id)[0].email;
      item.access = item.is_write ? 'Edit Only' : 'Read Only';
    });
    this.tasklists = this.tasklists.concat(tasklists);
  }

  async getTasklists() {
    this.loading = true;
    let numberOfRequest = 2;
    const [tasklist1, tasklist2] = await Promise.all([
      this.tasklistService.getTasklists()
        .then(response => {
          this.percentLoading += 95/numberOfRequest;
          return response;
        }),
      this.tasklistService.getTasklistsAuthorized()
        .then(response => {
          this.percentLoading += 95/numberOfRequest;
          return response;
        }),
    ]);

    setTimeout(() => { this.loading = false; }, 500);
    this.setTasklists(tasklist1);
    this.setTasklistsAuthorized(tasklist2);
    this.childViewModel.slicePage();
  }

  async getTasklist(tasklist_id: number) {
    const tasklist = await this.tasklistService.getTasklist(tasklist_id);
    this.tasklists.filter(h => h.id === tasklist_id)[0].name = tasklist.name;
  }

  public createTasklist() {
    this.tasklistService.createTasklist(this.tasklistName)
      .then(
        response => {
          this.tasklists.push(response);
          this.tasklists[this.tasklists.length - 1].is_write = true;
          this.tasklists[this.tasklists.length - 1].owner = true;
          this.tasklists[this.tasklists.length - 1].user = this.userService.getCurrentUser();
          this.tasklists[this.tasklists.length - 1].authorizedUsers = [];

          this.generalData.allTasklistOwner++;

          this.tasklistName = '';
          console.log('Create tasklist success');
        }
      )
      .then(() => {
        this.childViewModel.goToEndPage();
      })
      .catch((error) => console.log(`Create tasklist fail`, error))
  }

  deleteTasklist(id: number): void {
    this.tasklistService.deleteTasklist(id)
      .then(() => {
          this.tasklists = this.tasklists.filter(h => h.id !== id);
          this.generalData.allTasklistOwner--;
        }
      )
      .catch((error) => {
        console.log(`Delete tasklist ${id} fail`, error);
      })
  }
}

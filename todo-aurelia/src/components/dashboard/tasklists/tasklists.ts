import {Router} from 'aurelia-router';

import {TasklistService} from '../../../utils/services/tasklist.service'
import {UserService} from '../../../utils/user.service'
import {User, Tasklist} from '../../../utils/models'

import {autoinject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {TasklistDetail} from './tasklist-detail/tasklist-detail';
import {ShareTasklist} from './share-tasklist/share-tasklist';
import {EditTasklist} from './edit-tasklist/edit-tasklist';
import { start } from 'repl';

@autoinject()
export class TaskLists {
  data: Tasklist[] = [];

  numberRow: number;
  currentPageNumber: number = 1;
  maxPage: number;
  secondIndex: number | string;
  nearEndIndex: number | string;
  currentPages!: Tasklist[];

  rowNumberOptions = [
    { id: 0, value: 5 },
    { id: 1, value: 10 },
    { id: 2, value: 20 },
  ];

  tableTitles = [
    { id: 0, additionClass: "text-center", sortField: "id", displayText: "ID" },
    { id: 1, additionClass: "", sortField: "name", displayText: "List Name" },
    { id: 2, additionClass: "", sortField: "user", displayText: "User" },
    { id: 3, additionClass: "hidden-xs", sortField: "share_count", displayText: "Share" },
    { id: 4, additionClass: "hidden-xs", sortField: "todo_count", displayText: "Todo" },
    { id: 5, additionClass: "hidden-xs", sortField: "done_count", displayText: "Done" },
    { id: 6, additionClass: "hidden-xs", sortField: "", displayText: "Access" },
    { id: 7, additionClass: "text-center", sortField: "", displayText: "Actions" },
  ]

  public sortingInfo: { index: number, status: string } = { index: 1, status: 'sorting_asc' };

  pageStartIndex: number;
  pageEndIndex: number;

  
  paginationArray: Array<{ value: string, disabled: boolean, active: boolean }> = [];

  users: User[];
  tasklistName: string = '';
  generalData: any = {
    allTasklistOwner: 0, userShare: 0, allTodo:0, allDone:0
  };

  private increase: number = -1;

  constructor(
    private router: Router,
    public dialogService: DialogService,
    public tasklistService: TasklistService,
    public userService: UserService
  ) {
  }

  public changePaginationArray(): void {
    if (this.currentPageNumber > this.maxPage) {
      this.currentPageNumber = 1;
      this.slicePage();
    }
    this.paginationArray=[];
    if (this.maxPage < 8) {
      for (let i = 1; i <= this.maxPage; i++) {
        this.paginationArray.push({
          value: i.toString(),
          active: i == this.currentPageNumber,
          disabled: false
        })
      }
    }
    else {
      if (this.currentPageNumber < 5) {
        for (let i = 1; i <= 7; i++) {
          let defineValue = () => {
            if (i==6) return '...'
            if (i==7) return this.maxPage.toString();
            return i.toString();
          }
          this.paginationArray.push({
            value: defineValue(),
            active: i == this.currentPageNumber,
            disabled: defineValue() == '...'
          })
        }
      }

      if (this.currentPageNumber >= 5 && this.currentPageNumber < this.maxPage - 3) {
        for (let i = this.currentPageNumber - 3; i <= this.currentPageNumber + 3; i++) {
          let defineValue = () => {
            if (i == this.currentPageNumber - 3) return '1';
            if (i == this.currentPageNumber - 2 || i == this.currentPageNumber + 2) return '...'
            if (i == this.currentPageNumber + 3) return this.maxPage.toString();
            return i.toString();
          }
          this.paginationArray.push({
            value: defineValue(),
            active: i == this.currentPageNumber,
            disabled: defineValue() == '...'
          })
        }
      }

      if (this.currentPageNumber >= this.maxPage - 3) {
        for (let i = this.maxPage - 6; i <= this.maxPage; i++) {
          let defineValue = () => {
            if (i==this.maxPage - 6) return '1'
            if (i==this.maxPage - 5) return '...'
            return i.toString();
          }
          this.paginationArray.push({
            value: defineValue(),
            active: i == this.currentPageNumber,
            disabled: defineValue() == '...'
          })
        }
      }
    }
  }

  public slicePage(): void {
    setTimeout(() => {
      this.maxPage = Math.ceil(this.data.length / this.numberRow);          
      let startIndex = this.numberRow*(this.currentPageNumber-1);
      let endIndex = startIndex + this.numberRow;
      this.currentPages = this.data.slice(startIndex, endIndex);
      this.pageStartIndex = (this.currentPageNumber - 1) * this.numberRow + 1;
      this.pageEndIndex = this.currentPageNumber * this.numberRow < this.data.length ? this.currentPageNumber * this.numberRow : this.data.length;
      this.changePaginationArray();
    });
  }

  public goToPage(pageNumber): void {
    if (pageNumber === '...') return;
    this.currentPageNumber = +pageNumber;
    this.slicePage();
  }

  public previousPage(): void {
    this.currentPageNumber--;
    this.slicePage();
  }

  public nextPage(): void {
    this.currentPageNumber++;
    this.slicePage();
  }

  public atached(): void {
    this.slicePage();
  }

  sortDataTable(id: number, field: string): void {
    if (id != this.sortingInfo.index) { this.increase = 1; }
    else {
      this.increase = - this.increase;
    }

    this.data.sort((a, b) => {
      if (a[field] > b[field]) return this.increase;
      if (a[field] < b[field]) return - this.increase;
    });

    this.sortingInfo = { index: id, status: this.increase > 0 ? 'sorting_asc' : 'sorting_desc'};
    this.slicePage();
    this.goToPage('1');
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
    this.data = this.data.concat(tasklist);
    this.generalData.allTasklistOwner = tasklist.length;
    this.data.forEach((item) => {
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
    this.data = this.data.concat(tasklists);
  }

  async getTasklists() {
    const [tasklist1, tasklist2] = await Promise.all([
      this.tasklistService.getTasklists(),
      this.tasklistService.getTasklistsAuthorized(),
    ]);

    this.setTasklists(tasklist1);
    this.setTasklistsAuthorized(tasklist2);
    this.slicePage();
  }

  async getTasklist(tasklist_id: number) {
    const tasklist = await this.tasklistService.getTasklist(tasklist_id);
    this.data.filter(h => h.id === tasklist_id)[0].name = tasklist.name;
  }

  public createTasklist() {
    this.tasklistService.createTasklist(this.tasklistName)
      .then(
        response => {
          this.data.push(response);
          this.data[this.data.length - 1].is_write = true;
          this.data[this.data.length - 1].owner = true;
          this.data[this.data.length - 1].user = this.userService.getCurrentUser();
          this.data[this.data.length - 1].authorizedUsers = [];

          this.generalData.allTasklistOwner++;

          this.tasklistName = '';
          console.log('Create tasklist success');
        }
      )
      .then(() => {
        this.goToPage(Math.ceil(this.data.length / this.numberRow));
      })
      .catch((error) => console.log(`Create tasklist fail`, error))
  }

  deleteTasklist(id: number): void {
    this.tasklistService.deleteTasklist(id)
      .then(() => {
          this.data = this.data.filter(h => h.id !== id);
          this.generalData.allTasklistOwner--;
        }
      )
      .catch((error) => {
        console.log(`Delete tasklist ${id} fail`, error);
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

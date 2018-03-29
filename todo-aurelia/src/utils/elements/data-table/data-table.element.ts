import { autoinject, containerless, bindable, bindingMode } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { TableTitle } from '../../../utils/models';
import { Tasklist } from '../../../utils/models/tasklist';

import { TasklistService } from '../../../utils/services/tasklist.service'
import { UserService } from '../../../utils/user.service'

import { TasklistDetail } from '../../../components/dashboard/tasklists/tasklist-detail/tasklist-detail';
import { ShareTasklist } from '../../../components/dashboard/tasklists/share-tasklist/share-tasklist';
import { EditTasklist } from '../../../components/dashboard/tasklists/edit-tasklist/edit-tasklist';

@containerless
export class DataTableCustomElement {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public rowNumberOptions!: Array<number>;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public tableTitles!: TableTitle[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public tableContents!: Tasklist[];

  constructor(
    public dialogService: DialogService,
    public tasklistService: TasklistService,
    public userService: UserService
  ) {
  }

  generalData: any = {
    allTasklistOwner: 0, userShare: 0, allTodo:0, allDone:0
  };

  public numberRow: number;
  public rowNumberOptionsMap!: Array<{ id: number, value: number }>;

  currentPageNumber: number = 1;
  maxPage: number;
  secondIndex: number | string;
  nearEndIndex: number | string;
  currentPages!: Tasklist[];

  pageStartIndex: number;
  pageEndIndex: number;

  private increase: number = -1;
  public sortingInfo: { index: number, status: string } = { index: null, status: null };

  paginationArray: Array<{ value: string, disabled: boolean, active: boolean }> = [];

  public attached(): void {
    this.rowNumberOptionsMap = this.rowNumberOptions.map((item, index) => {
      return { id: index, value: item }
    });
    this.slicePage();
  }

  public slicePage(): void {
    setTimeout(() => {
      this.maxPage = Math.ceil(this.tableContents.length / this.numberRow);          
      let startIndex = this.numberRow*(this.currentPageNumber-1);
      let endIndex = startIndex + this.numberRow;
      this.currentPages = this.tableContents.slice(startIndex, endIndex);
      this.pageStartIndex = (this.currentPageNumber - 1) * this.numberRow + 1;
      this.pageEndIndex = this.currentPageNumber * this.numberRow < this.tableContents.length ? this.currentPageNumber * this.numberRow : this.tableContents.length;
      this.changePaginationArray();
    });
  }

  public goToPage(pageNumber): void {
    if (pageNumber === '...') return;
    this.currentPageNumber = +pageNumber;
    this.slicePage();
  }

  public goToEndPage(): void {
    this.currentPageNumber = this.maxPage;
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

  sortDataTable(id: number, field: string): void {
    if (id != this.sortingInfo.index) { this.increase = 1; }
    else {
      this.increase = - this.increase;
    }

    this.tableContents.sort((a, b) => {
      if (a[field] > b[field]) return this.increase;
      if (a[field] < b[field]) return - this.increase;
    });

    this.sortingInfo = { index: id, status: this.increase > 0 ? 'sorting_asc' : 'sorting_desc'};
    this.slicePage();
    this.goToPage('1');
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


  deleteTasklist(id: number): void {
    this.tasklistService.deleteTasklist(id)
      .then(() => {
          this.tableContents = this.tableContents.filter(h => h.id !== id);
          this.generalData.allTasklistOwner--;
        }
      )
      .then( () => {
        this.slicePage();
      })
      .catch((error) => {
        console.log(`Delete tasklist ${id} fail`, error);
      })
  }

  showDetail(item) {
    this.dialogService.open({ viewModel: TasklistDetail, model: item })
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
    this.dialogService.open({ viewModel: ShareTasklist, model: item })
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
    this.dialogService.open({ viewModel: EditTasklist, model: item })
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

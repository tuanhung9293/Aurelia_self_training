import {Router} from 'aurelia-router';

import {TasklistService} from '../../../utils/services/tasklist.service'
import {UserService} from '../../../utils/user.service'
import {User, Tasklist} from '../../../utils/models'

import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {TasklistDetail} from './tasklist-detail/tasklist-detail';
import {ShareTasklist} from './share-tasklist/share-tasklist';
import {EditTasklist} from './edit-tasklist/edit-tasklist';

import * as jQuery from 'jquery';

@inject(Router, DialogService, TasklistService, UserService)
export class TaskLists {
  data: Tasklist[] = [];
  users: User[];
  tasklistName: string = '';
  generalData: any = {
    allTasklistOwner: 0, userShare: 0, allTodo:0, allDone:0
  };

  constructor(private router: Router,
              public dialogService: DialogService,
              public tasklistService: TasklistService,
              public userService: UserService) {
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
          this.generalData.allTasklistOwner = this.data.length;

          this.data.forEach((item) => {
            this.generalData.allTodo += item.todo_count;
            this.generalData.userShare += item.share_count;
            this.generalData.allDone += item.done_count;
            item.owner = true;
            item.is_write = true;
            item.access = 'Full Access';
            item.user = this.userService.getCurrentUser();
          });

          this.getTasklistsAuthorized();
        }
      )
      .catch((error) => console.log('getTasklists fail', error))
  }

  getTasklistsAuthorized() {
    this.tasklistService.getTasklistsAuthorized()
      .then(
        data => {
          data.forEach((item) => {
            item.user = this.users.filter(h => h.id === item.user_id)[0].email;
            item.access = item.is_write ? 'Edit Only' : 'Read Only';
          });
          this.data = this.data.concat(data);
          console.log('getTasklistsAuthorized success');
        }
      )
      .then(() => this.renderDatatable())
      .catch(() => console.log('getTasklistsAuthorized fail'))
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
          this.data[this.data.length - 1].user = this.userService.getCurrentUser();
          this.data[this.data.length - 1].authorizedUsers = [];

          this.generalData.allTasklistOwner++;

          this.tasklistName = '';
          console.log('Create tasklist success');
        }
      )
      .catch((error) => console.log(`Create tasklist fail`, error))
  }

  deleteTasklist(id: number): void {
    this.tasklistService.deleteTasklist(id)
      .then(() => {
          this.data = this.data.filter(h => h.id !== id);
          this.generalData.allTasklistOwner--;
          // this.generalData.userShare -= this.data.filter(h => h.id === id)[0].share_count;
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

  renderDatatable() {
    let BaseTableDatatables = function () {
      // Init full DataTable
      let initDataTableFull = function () {
        jQuery('.js-dataTable-full').DataTable({
          columnDefs: [{orderable: false, targets: [4]}],
          pageLength: 10,
          lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]]
        });
      };

      // DataTables Bootstrap integration
      let bsDataTables = function () {
        let $DataTable = jQuery.fn.dataTable;

        // Set the defaults for DataTables init
        jQuery.extend(true, $DataTable.defaults, {
          dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
          "<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-6'i><'col-sm-6'p>>",
          renderer: 'bootstrap',
          oLanguage: {
            sLengthMenu: "_MENU_",
            sInfo: "Showing <strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
            oPaginate: {
              sPrevious: '<i class="fa fa-angle-left"></i>',
              sNext: '<i class="fa fa-angle-right"></i>'
            }
          }
        });

        // Default class modification
        jQuery.extend($DataTable.ext.classes, {
          sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
          sFilterInput: "form-control",
          sLengthSelect: "form-control"
        });

        // Bootstrap paging button renderer
        $DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
          let api = new $DataTable.Api(settings);
          let classes = settings.oClasses;
          let lang = settings.oLanguage.oPaginate;
          let btnDisplay, btnClass;

          let attach = function (container, buttons) {
            let i, ien, node, button;
            let clickHandler = function (e) {
              e.preventDefault();
              if (!jQuery(e.currentTarget).hasClass('disabled')) {
                api.page(e.data.action).draw(false);
              }
            };

            for (i = 0, ien = buttons.length; i < ien; i++) {
              button = buttons[i];

              if (jQuery.isArray(button)) {
                attach(container, button);
              }
              else {
                btnDisplay = '';
                btnClass = '';

                switch (button) {
                  case 'ellipsis':
                    btnDisplay = '&hellip;';
                    btnClass = 'disabled';
                    break;

                  case 'first':
                    btnDisplay = lang.sFirst;
                    btnClass = button + (page > 0 ? '' : ' disabled');
                    break;

                  case 'previous':
                    btnDisplay = lang.sPrevious;
                    btnClass = button + (page > 0 ? '' : ' disabled');
                    break;

                  case 'next':
                    btnDisplay = lang.sNext;
                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                    break;

                  case 'last':
                    btnDisplay = lang.sLast;
                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                    break;

                  default:
                    btnDisplay = button + 1;
                    btnClass = page === button ?
                      'active' : '';
                    break;
                }

                if (btnDisplay) {
                  node = jQuery('<li>', {
                    'class': classes.sPageButton + ' ' + btnClass,
                    'aria-controls': settings.sTableId,
                    'tabindex': settings.iTabIndex,
                    'id': idx === 0 && typeof button === 'string' ?
                      settings.sTableId + '_' + button :
                      null
                  })
                    .append(jQuery('<a>', {
                        'href': '#'
                      })
                        .html(btnDisplay)
                    )
                    .appendTo(container);

                  settings.oApi._fnBindAction(
                    node, {action: button}, clickHandler
                  );
                }
              }
            }
          };

          attach(
            jQuery(host).empty().html('<ul class="pagination"/>').children('ul'),
            buttons
          );
        };

        // TableTools Bootstrap compatibility - Required TableTools 2.1+
        if ($DataTable.TableTools) {
          // Set the classes that TableTools uses to something suitable for Bootstrap
          jQuery.extend(true, $DataTable.TableTools.classes, {
            "container": "DTTT btn-group",
            "buttons": {
              "normal": "btn btn-default",
              "disabled": "disabled"
            },
            "collection": {
              "container": "DTTT_dropdown dropdown-menu",
              "buttons": {
                "normal": "",
                "disabled": "disabled"
              }
            },
            "print": {
              "info": "DTTT_print_info"
            },
            "select": {
              "row": "active"
            }
          });

          // Have the collection use a bootstrap compatible drop down
          jQuery.extend(true, $DataTable.TableTools.DEFAULTS.oTags, {
            "collection": {
              "container": "ul",
              "button": "li",
              "liner": "a"
            }
          });
        }
      };

      return {
        init: function () {
          bsDataTables();
          initDataTableFull();
        }
      };
    }();

    // Initialize when page loads
    jQuery(function () {
      BaseTableDatatables.init();
    });
  }
}

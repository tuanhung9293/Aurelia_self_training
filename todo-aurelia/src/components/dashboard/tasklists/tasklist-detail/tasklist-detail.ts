import {autoinject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {Todo, Tasklist} from '../../../../utils/models';
import {TasklistService} from '../../../../utils/services/tasklist.service';

const mockdata: Todo[] = [
  {id: 1, name: 'todo1', done: true},
  {id: 2, name: 'todo2', done: true},
  {id: 3, name: 'todo3', done: true},
  {id: 4, name: 'todo4', done: false},
  {id: 5, name: 'todo5', done: false},
  {id: 6, name: 'todo6', done: false},
];

@autoinject()
export class TasklistDetail {
  tasklist: Tasklist;
  todos: Todo[] = [];
  newTodo: string = '';

  constructor(private controller: DialogController,
              private tasklistService: TasklistService) {
  }

  activate(tasklist) {
    this.tasklist = tasklist;
  }

  created() {
    this.getTodos();
  }

  getTodos() {
    this.tasklistService.getTodos(this.tasklist.id)
      .then(
        data => {
          this.todos = data;
          console.log('Get todos success');
        })
      .catch(error => console.log('Get todos fail'))
  }

  addTodo(newTodo) {
    this.tasklistService.addTodo(this.tasklist.id, this.newTodo)
      .then(
        () => {
          console.log(`Add todos ${this.newTodo} success`);
          this.getTodos();
        })
      .catch(error => console.log(`Add todos ${this.newTodo} fail`))
    this.newTodo = '';
  }

  updateTodo(todo_id: number) {
    this.tasklistService.updateTodo(this.tasklist.id, todo_id)
      .then(
        data => {
          console.log(`Done todo ${todo_id} success`);
          this.getTodos();
        })
      .catch(error => console.log(`Done todo ${todo_id} fail`)
    )
  }

  deleteTodo(todo_id: number) {
    this.tasklistService.deleteTodo(this.tasklist.id, todo_id)
      .then(
        data => {
          console.log(`Delete todo ${todo_id} success`);
          this.getTodos();
        })
      .catch(error => {
        console.log(`Delete todo ${todo_id} fail`);
        this.getTodos();
      })
  }

  doneAllTodos() {
    this.todos.forEach((item) => {
      if (!item.done) {
        this.updateTodo(item.id);
      }
    });
    console.log('Done all todos');
  }

  deleteAllDones() {
    this.todos.forEach((item) => {
      if (item.done) {
        this.deleteTodo(item.id);
      }
    });
    console.log('Delete all dones');
  }
}

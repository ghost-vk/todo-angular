import { IProjectOption } from "../interfaces/project-option";
import { plainToInstance } from "class-transformer";
import { Todo } from './todo'

export class Project {
  constructor(
    public id: number,
    public _title: string,
    public todos: Todo[]
  ) { }

  getOption(): IProjectOption {
    return {
      viewValue: this.title,
      value: this.id
    }
  }

  plainTodosToInstances() {
    this.todos = plainToInstance(Todo, this.todos.map(todo => ({ todo })))
  }

  addTodo(todo: Todo) {
    this.todos.push(todo)
  }

  deleteTodo(todoId: number) {
    this.todos = this.todos.filter(t => t.id !== todoId)
  }

  updateTodo(newTodo: Todo) {
    this.todos = this.todos.map(todo => todo.id !== newTodo.id ? todo : newTodo)
  }

  set title(title: string) {
    this._title = title
  }

  get title(): string {
    return this._title
  }
}



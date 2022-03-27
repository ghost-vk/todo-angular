import { Todo } from '../interfaces/todo'
import { ProjectOption } from "../interfaces/project-option";


export interface IProject {
  id: number,
  title: string,
  todos: Todo[]
}

export class Project {
  constructor(
    public id: number,
    public _title: string,
    public todos: Todo[]
  ) { }

  getOption(): ProjectOption {
    return {
      viewValue: this.title,
      value: this.id
    }
  }

  updateTodo(todo: Todo) {
    this.todos = this.todos.map(t => t.id !== todo.id ? t : todo)
  }

  set title(title: string) {
    this._title = title
  }

  get title(): string {
    return this._title
  }
}



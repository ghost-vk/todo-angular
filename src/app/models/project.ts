import { ITodo } from '../interfaces/todo'
import { ProjectOption } from "../interfaces/project-option";
import { plainToClass } from "class-transformer";
import { Todo } from './todo'

export class Project {
  public todos: Todo[]

  constructor(
    public id: number,
    public _title: string,
  ) { }

  getOption(): ProjectOption {
    return {
      viewValue: this.title,
      value: this.id
    }
  }

  fillTodos(todos: ITodo[]) {
    this.todos = plainToClass(Todo, todos)
  }

  // updateTodo(todo: ITodo) {
  //   this.todos = this.todos.map(t => t.id !== todo.id ? t : todo)
  // }

  deleteTodo(todoId: number) {
    this.todos = this.todos.filter(t => t.id !== todoId)
  }

  set title(title: string) {
    this._title = title
  }

  get title(): string {
    return this._title
  }
}



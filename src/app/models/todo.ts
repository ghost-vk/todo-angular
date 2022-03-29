import { ITodo } from '../interfaces/todo'

export class Todo {
  constructor(public todo: ITodo) { }

  isCompleted() {
    return this.todo.is_completed
  }

  get text(): string {
    return this.todo.text
  }

  set text(val: string) {
    this.todo.text = val
  }

  get project(): number {
    return this.todo.id
  }

  get id(): number {
    return this.todo.id
  }
}

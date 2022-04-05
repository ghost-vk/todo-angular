import { ITodo } from '../interfaces/todo'

export class Todo {
  constructor(public todo: ITodo) { }

  get isCompleted(): boolean {
    return this.todo.is_completed
  }

  set isCompleted(val: boolean) {
    this.todo.is_completed = val
  }

  get text(): string {
    return this.todo.text
  }

  set text(val: string) {
    this.todo.text = val
  }

  get id(): number {
    return this.todo.id
  }
}

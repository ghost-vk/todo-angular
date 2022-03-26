import { Component, Input, EventEmitter, Output } from '@angular/core'
import { Todo } from "../interfaces/todo";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @Input() public todo: Todo

  openTask() {
    console.log('open task to edit')
  }

  @Output() public check = new EventEmitter<Todo>()

  onCheck(todo: Todo, checked: boolean) {
    this.check.emit({ ...todo, is_completed: checked })
  }
}

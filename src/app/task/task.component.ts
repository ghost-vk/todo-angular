import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core'
import { Todo } from "../models/todo";
import { ITodo } from '../interfaces/todo'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  isEditBtnVisible: boolean

  ngOnInit() {
    this.isEditBtnVisible = false
  }

  @Input() public todo: Todo

  @Output() public check = new EventEmitter<ITodo>()

  onCheck(checked: boolean) {
    this.check.emit({
      id: this.todo.id,
      text: this.todo.text,
      is_completed: checked
    })
  }

  @Output() public update = new EventEmitter<number>()

  onUpdateTodo() {
    this.update.emit(this.todo.id)
  }
}

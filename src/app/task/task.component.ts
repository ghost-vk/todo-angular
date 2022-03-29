import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core'
import { ITodo } from "../interfaces/todo";

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

  @Input() public todo: ITodo

  openTask() {
    console.log('open task to edit')
  }

  @Output() public check = new EventEmitter<ITodo>()

  onCheck(todo: ITodo, checked: boolean) {
    this.check.emit({ ...todo, is_completed: checked })
  }

  @Output() public update = new EventEmitter<ITodo>()

  onUpdateTodo() {
    this.update.emit(this.todo)
  }
}

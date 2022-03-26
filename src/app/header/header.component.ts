import { Component, Output, EventEmitter } from '@angular/core'
import { Dialog } from "../interfaces/dialog";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.components.scss']
})
export class HeaderComponent {

  @Output() dialogEvent = new EventEmitter<Dialog>()

  addTask() {
    this.dialogEvent.emit({ type: 'task' })
  }

  addProject() {
    this.dialogEvent.emit({ type: 'project' })
  }
}

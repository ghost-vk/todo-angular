import { TaskValues } from "./task-values";
import { ProjectValues } from "./project-values";

export interface DialogResult {
  task?: TaskValues,
  project?: ProjectValues
}

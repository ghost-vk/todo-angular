import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from 'src/environments/environment';

import { Project } from "../models/project";
import { plainToClass } from "class-transformer";
import { IProjectResponse } from "../interfaces/project-response";

const BASE_URL = environment.production
  ? 'https://todo-oblako-group.herokuapp.com'
  : 'http://localhost:3000'

@Injectable({ providedIn: "root" })
export class ProjectCollectionService {
  private projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([])
  projects$: Observable<Project[]> = this.projects.asObservable()

  constructor(private httpClient: HttpClient) { }

  fetchProjects() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxM30.2kEoiuxIRz4BHYDuioi1pDho_6g7rB-y-Q-m1Pvs_vI')

    this.httpClient.get<IProjectResponse[]>(`${BASE_URL}/projects`, { headers })
      .subscribe((response: IProjectResponse[]) => {
        const projects: Project[] = plainToClass(Project, response)
        this.projects.next(projects)

        console.log(this.projects$)
      })
  }
}

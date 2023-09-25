import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectGoal, NewProjectGoal } from '../project-goal.model';

export type PartialUpdateProjectGoal = Partial<IProjectGoal> & Pick<IProjectGoal, 'id'>;

export type EntityResponseType = HttpResponse<IProjectGoal>;
export type EntityArrayResponseType = HttpResponse<IProjectGoal[]>;

@Injectable({ providedIn: 'root' })
export class ProjectGoalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-goals');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(projectGoal: NewProjectGoal): Observable<EntityResponseType> {
    return this.http.post<IProjectGoal>(this.resourceUrl, projectGoal, { observe: 'response' });
  }

  update(projectGoal: IProjectGoal): Observable<EntityResponseType> {
    return this.http.put<IProjectGoal>(`${this.resourceUrl}/${this.getProjectGoalIdentifier(projectGoal)}`, projectGoal, {
      observe: 'response',
    });
  }

  partialUpdate(projectGoal: PartialUpdateProjectGoal): Observable<EntityResponseType> {
    return this.http.patch<IProjectGoal>(`${this.resourceUrl}/${this.getProjectGoalIdentifier(projectGoal)}`, projectGoal, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProjectGoal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProjectGoal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjectGoalIdentifier(projectGoal: Pick<IProjectGoal, 'id'>): number {
    return projectGoal.id;
  }

  compareProjectGoal(o1: Pick<IProjectGoal, 'id'> | null, o2: Pick<IProjectGoal, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjectGoalIdentifier(o1) === this.getProjectGoalIdentifier(o2) : o1 === o2;
  }

  addProjectGoalToCollectionIfMissing<Type extends Pick<IProjectGoal, 'id'>>(
    projectGoalCollection: Type[],
    ...projectGoalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projectGoals: Type[] = projectGoalsToCheck.filter(isPresent);
    if (projectGoals.length > 0) {
      const projectGoalCollectionIdentifiers = projectGoalCollection.map(
        projectGoalItem => this.getProjectGoalIdentifier(projectGoalItem)!,
      );
      const projectGoalsToAdd = projectGoals.filter(projectGoalItem => {
        const projectGoalIdentifier = this.getProjectGoalIdentifier(projectGoalItem);
        if (projectGoalCollectionIdentifiers.includes(projectGoalIdentifier)) {
          return false;
        }
        projectGoalCollectionIdentifiers.push(projectGoalIdentifier);
        return true;
      });
      return [...projectGoalsToAdd, ...projectGoalCollection];
    }
    return projectGoalCollection;
  }
}

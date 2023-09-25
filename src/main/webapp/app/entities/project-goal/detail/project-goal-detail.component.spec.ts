import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectGoalDetailComponent } from './project-goal-detail.component';

describe('ProjectGoal Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectGoalDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProjectGoalDetailComponent,
              resolve: { projectGoal: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProjectGoalDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load projectGoal on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProjectGoalDetailComponent);

      // THEN
      expect(instance.projectGoal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

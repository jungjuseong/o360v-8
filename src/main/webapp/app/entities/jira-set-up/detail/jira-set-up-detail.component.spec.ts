import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JiraSetUpDetailComponent } from './jira-set-up-detail.component';

describe('JiraSetUp Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JiraSetUpDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: JiraSetUpDetailComponent,
              resolve: { jiraSetUp: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JiraSetUpDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load jiraSetUp on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JiraSetUpDetailComponent);

      // THEN
      expect(instance.jiraSetUp).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

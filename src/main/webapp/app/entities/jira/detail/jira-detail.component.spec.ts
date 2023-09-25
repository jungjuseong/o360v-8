import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JiraDetailComponent } from './jira-detail.component';

describe('Jira Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JiraDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: JiraDetailComponent,
              resolve: { jira: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JiraDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load jira on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JiraDetailComponent);

      // THEN
      expect(instance.jira).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

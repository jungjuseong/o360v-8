import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectDateDetailComponent } from './project-date-detail.component';

describe('ProjectDate Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDateDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProjectDateDetailComponent,
              resolve: { projectDate: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProjectDateDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load projectDate on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProjectDateDetailComponent);

      // THEN
      expect(instance.projectDate).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

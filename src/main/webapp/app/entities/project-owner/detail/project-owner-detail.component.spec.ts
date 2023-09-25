import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectOwnerDetailComponent } from './project-owner-detail.component';

describe('ProjectOwner Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOwnerDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProjectOwnerDetailComponent,
              resolve: { projectOwner: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProjectOwnerDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load projectOwner on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProjectOwnerDetailComponent);

      // THEN
      expect(instance.projectOwner).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

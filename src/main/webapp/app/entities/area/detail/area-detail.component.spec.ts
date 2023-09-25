import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AreaDetailComponent } from './area-detail.component';

describe('Area Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AreaDetailComponent,
              resolve: { area: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AreaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load area on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AreaDetailComponent);

      // THEN
      expect(instance.area).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

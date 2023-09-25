import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AudienceDetailComponent } from './audience-detail.component';

describe('Audience Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AudienceDetailComponent,
              resolve: { audience: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AudienceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load audience on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AudienceDetailComponent);

      // THEN
      expect(instance.audience).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

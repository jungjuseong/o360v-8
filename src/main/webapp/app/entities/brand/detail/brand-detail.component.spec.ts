import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BrandDetailComponent } from './brand-detail.component';

describe('Brand Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: BrandDetailComponent,
              resolve: { brand: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BrandDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load brand on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BrandDetailComponent);

      // THEN
      expect(instance.brand).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

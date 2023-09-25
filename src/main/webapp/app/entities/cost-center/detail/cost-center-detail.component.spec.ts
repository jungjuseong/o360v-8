import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CostCenterDetailComponent } from './cost-center-detail.component';

describe('CostCenter Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCenterDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CostCenterDetailComponent,
              resolve: { costCenter: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CostCenterDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load costCenter on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CostCenterDetailComponent);

      // THEN
      expect(instance.costCenter).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

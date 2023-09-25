import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StakeholderDetailComponent } from './stakeholder-detail.component';

describe('Stakeholder Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StakeholderDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: StakeholderDetailComponent,
              resolve: { stakeholder: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(StakeholderDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load stakeholder on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StakeholderDetailComponent);

      // THEN
      expect(instance.stakeholder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

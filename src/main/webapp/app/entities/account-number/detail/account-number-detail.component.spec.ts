import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AccountNumberDetailComponent } from './account-number-detail.component';

describe('AccountNumber Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountNumberDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AccountNumberDetailComponent,
              resolve: { accountNumber: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AccountNumberDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load accountNumber on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AccountNumberDetailComponent);

      // THEN
      expect(instance.accountNumber).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

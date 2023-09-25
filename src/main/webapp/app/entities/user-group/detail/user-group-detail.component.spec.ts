import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserGroupDetailComponent } from './user-group-detail.component';

describe('UserGroup Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGroupDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UserGroupDetailComponent,
              resolve: { userGroup: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UserGroupDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load userGroup on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UserGroupDetailComponent);

      // THEN
      expect(instance.userGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

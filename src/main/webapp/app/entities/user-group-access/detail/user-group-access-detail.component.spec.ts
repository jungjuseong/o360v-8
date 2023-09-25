import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserGroupAccessDetailComponent } from './user-group-access-detail.component';

describe('UserGroupAccess Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGroupAccessDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UserGroupAccessDetailComponent,
              resolve: { userGroupAccess: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UserGroupAccessDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load userGroupAccess on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UserGroupAccessDetailComponent);

      // THEN
      expect(instance.userGroupAccess).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

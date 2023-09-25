import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { UserGroupService } from '../service/user-group.service';
import { IUserGroup } from '../user-group.model';

import { UserGroupFormService } from './user-group-form.service';

import { UserGroupUpdateComponent } from './user-group-update.component';

describe('UserGroup Management Update Component', () => {
  let comp: UserGroupUpdateComponent;
  let fixture: ComponentFixture<UserGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userGroupFormService: UserGroupFormService;
  let userGroupService: UserGroupService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UserGroupUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UserGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userGroupFormService = TestBed.inject(UserGroupFormService);
    userGroupService = TestBed.inject(UserGroupService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userGroup: IUserGroup = { id: 456 };
      const users: IUser[] = [{ id: 'd67db2a7-f643-44f2-a9bc-6bd201148c98' }];
      userGroup.users = users;

      const userCollection: IUser[] = [{ id: '0cbbc18c-4fe0-4cac-80b9-5c8ba47baa23' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [...users];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroup });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userGroup: IUserGroup = { id: 456 };
      const user: IUser = { id: '3bd4d835-7802-4579-8ae5-3e148b01e1d5' };
      userGroup.users = [user];

      activatedRoute.data = of({ userGroup });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userGroup).toEqual(userGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroup>>();
      const userGroup = { id: 123 };
      jest.spyOn(userGroupFormService, 'getUserGroup').mockReturnValue(userGroup);
      jest.spyOn(userGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroup }));
      saveSubject.complete();

      // THEN
      expect(userGroupFormService.getUserGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userGroupService.update).toHaveBeenCalledWith(expect.objectContaining(userGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroup>>();
      const userGroup = { id: 123 };
      jest.spyOn(userGroupFormService, 'getUserGroup').mockReturnValue({ id: null });
      jest.spyOn(userGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroup }));
      saveSubject.complete();

      // THEN
      expect(userGroupFormService.getUserGroup).toHaveBeenCalled();
      expect(userGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroup>>();
      const userGroup = { id: 123 };
      jest.spyOn(userGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

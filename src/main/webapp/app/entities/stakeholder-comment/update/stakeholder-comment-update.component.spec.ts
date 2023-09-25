import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IStakeholder } from 'app/entities/stakeholder/stakeholder.model';
import { StakeholderService } from 'app/entities/stakeholder/service/stakeholder.service';
import { IStakeholderComment } from '../stakeholder-comment.model';
import { StakeholderCommentService } from '../service/stakeholder-comment.service';
import { StakeholderCommentFormService } from './stakeholder-comment-form.service';

import { StakeholderCommentUpdateComponent } from './stakeholder-comment-update.component';

describe('StakeholderComment Management Update Component', () => {
  let comp: StakeholderCommentUpdateComponent;
  let fixture: ComponentFixture<StakeholderCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stakeholderCommentFormService: StakeholderCommentFormService;
  let stakeholderCommentService: StakeholderCommentService;
  let userService: UserService;
  let stakeholderService: StakeholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), StakeholderCommentUpdateComponent],
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
      .overrideTemplate(StakeholderCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StakeholderCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stakeholderCommentFormService = TestBed.inject(StakeholderCommentFormService);
    stakeholderCommentService = TestBed.inject(StakeholderCommentService);
    userService = TestBed.inject(UserService);
    stakeholderService = TestBed.inject(StakeholderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const stakeholderComment: IStakeholderComment = { id: 456 };
      const user: IUser = { id: '6343a096-4833-4a2b-8ccd-c44ff2c94286' };
      stakeholderComment.user = user;

      const userCollection: IUser[] = [{ id: 'b7cf7734-e4fa-4a3d-a6da-a8078860a5f3' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stakeholderComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Stakeholder query and add missing value', () => {
      const stakeholderComment: IStakeholderComment = { id: 456 };
      const stakeholder: IStakeholder = { id: 10014 };
      stakeholderComment.stakeholder = stakeholder;

      const stakeholderCollection: IStakeholder[] = [{ id: 5040 }];
      jest.spyOn(stakeholderService, 'query').mockReturnValue(of(new HttpResponse({ body: stakeholderCollection })));
      const additionalStakeholders = [stakeholder];
      const expectedCollection: IStakeholder[] = [...additionalStakeholders, ...stakeholderCollection];
      jest.spyOn(stakeholderService, 'addStakeholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stakeholderComment });
      comp.ngOnInit();

      expect(stakeholderService.query).toHaveBeenCalled();
      expect(stakeholderService.addStakeholderToCollectionIfMissing).toHaveBeenCalledWith(
        stakeholderCollection,
        ...additionalStakeholders.map(expect.objectContaining),
      );
      expect(comp.stakeholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const stakeholderComment: IStakeholderComment = { id: 456 };
      const user: IUser = { id: 'd73bcaf7-aa40-4ee4-b33f-006b2ebb1139' };
      stakeholderComment.user = user;
      const stakeholder: IStakeholder = { id: 22423 };
      stakeholderComment.stakeholder = stakeholder;

      activatedRoute.data = of({ stakeholderComment });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.stakeholdersSharedCollection).toContain(stakeholder);
      expect(comp.stakeholderComment).toEqual(stakeholderComment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStakeholderComment>>();
      const stakeholderComment = { id: 123 };
      jest.spyOn(stakeholderCommentFormService, 'getStakeholderComment').mockReturnValue(stakeholderComment);
      jest.spyOn(stakeholderCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stakeholderComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stakeholderComment }));
      saveSubject.complete();

      // THEN
      expect(stakeholderCommentFormService.getStakeholderComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stakeholderCommentService.update).toHaveBeenCalledWith(expect.objectContaining(stakeholderComment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStakeholderComment>>();
      const stakeholderComment = { id: 123 };
      jest.spyOn(stakeholderCommentFormService, 'getStakeholderComment').mockReturnValue({ id: null });
      jest.spyOn(stakeholderCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stakeholderComment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stakeholderComment }));
      saveSubject.complete();

      // THEN
      expect(stakeholderCommentFormService.getStakeholderComment).toHaveBeenCalled();
      expect(stakeholderCommentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStakeholderComment>>();
      const stakeholderComment = { id: 123 };
      jest.spyOn(stakeholderCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stakeholderComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stakeholderCommentService.update).toHaveBeenCalled();
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

    describe('compareStakeholder', () => {
      it('Should forward to stakeholderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(stakeholderService, 'compareStakeholder');
        comp.compareStakeholder(entity, entity2);
        expect(stakeholderService.compareStakeholder).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

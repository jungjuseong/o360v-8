import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../project-comment.test-samples';

import { ProjectCommentFormService } from './project-comment-form.service';

describe('ProjectComment Form Service', () => {
  let service: ProjectCommentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCommentFormService);
  });

  describe('Service methods', () => {
    describe('createProjectCommentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProjectCommentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            comment: expect.any(Object),
            user: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });

      it('passing IProjectComment should create a new form with FormGroup', () => {
        const formGroup = service.createProjectCommentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            comment: expect.any(Object),
            user: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });
    });

    describe('getProjectComment', () => {
      it('should return NewProjectComment for default ProjectComment initial value', () => {
        const formGroup = service.createProjectCommentFormGroup(sampleWithNewData);

        const projectComment = service.getProjectComment(formGroup) as any;

        expect(projectComment).toMatchObject(sampleWithNewData);
      });

      it('should return NewProjectComment for empty ProjectComment initial value', () => {
        const formGroup = service.createProjectCommentFormGroup();

        const projectComment = service.getProjectComment(formGroup) as any;

        expect(projectComment).toMatchObject({});
      });

      it('should return IProjectComment', () => {
        const formGroup = service.createProjectCommentFormGroup(sampleWithRequiredData);

        const projectComment = service.getProjectComment(formGroup) as any;

        expect(projectComment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProjectComment should not enable id FormControl', () => {
        const formGroup = service.createProjectCommentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProjectComment should disable id FormControl', () => {
        const formGroup = service.createProjectCommentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

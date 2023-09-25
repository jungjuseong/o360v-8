import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProjectComment } from '../project-comment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../project-comment.test-samples';

import { ProjectCommentService, RestProjectComment } from './project-comment.service';

const requireRestSample: RestProjectComment = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
};

describe('ProjectComment Service', () => {
  let service: ProjectCommentService;
  let httpMock: HttpTestingController;
  let expectedResult: IProjectComment | IProjectComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectCommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ProjectComment', () => {
      const projectComment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(projectComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectComment', () => {
      const projectComment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(projectComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectComment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectComment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProjectComment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProjectCommentToCollectionIfMissing', () => {
      it('should add a ProjectComment to an empty array', () => {
        const projectComment: IProjectComment = sampleWithRequiredData;
        expectedResult = service.addProjectCommentToCollectionIfMissing([], projectComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectComment);
      });

      it('should not add a ProjectComment to an array that contains it', () => {
        const projectComment: IProjectComment = sampleWithRequiredData;
        const projectCommentCollection: IProjectComment[] = [
          {
            ...projectComment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProjectCommentToCollectionIfMissing(projectCommentCollection, projectComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectComment to an array that doesn't contain it", () => {
        const projectComment: IProjectComment = sampleWithRequiredData;
        const projectCommentCollection: IProjectComment[] = [sampleWithPartialData];
        expectedResult = service.addProjectCommentToCollectionIfMissing(projectCommentCollection, projectComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectComment);
      });

      it('should add only unique ProjectComment to an array', () => {
        const projectCommentArray: IProjectComment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const projectCommentCollection: IProjectComment[] = [sampleWithRequiredData];
        expectedResult = service.addProjectCommentToCollectionIfMissing(projectCommentCollection, ...projectCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectComment: IProjectComment = sampleWithRequiredData;
        const projectComment2: IProjectComment = sampleWithPartialData;
        expectedResult = service.addProjectCommentToCollectionIfMissing([], projectComment, projectComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectComment);
        expect(expectedResult).toContain(projectComment2);
      });

      it('should accept null and undefined values', () => {
        const projectComment: IProjectComment = sampleWithRequiredData;
        expectedResult = service.addProjectCommentToCollectionIfMissing([], null, projectComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectComment);
      });

      it('should return initial array if no ProjectComment is added', () => {
        const projectCommentCollection: IProjectComment[] = [sampleWithRequiredData];
        expectedResult = service.addProjectCommentToCollectionIfMissing(projectCommentCollection, undefined, null);
        expect(expectedResult).toEqual(projectCommentCollection);
      });
    });

    describe('compareProjectComment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProjectComment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProjectComment(entity1, entity2);
        const compareResult2 = service.compareProjectComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProjectComment(entity1, entity2);
        const compareResult2 = service.compareProjectComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProjectComment(entity1, entity2);
        const compareResult2 = service.compareProjectComment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

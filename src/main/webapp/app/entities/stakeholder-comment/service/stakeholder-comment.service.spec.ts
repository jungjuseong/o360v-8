import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStakeholderComment } from '../stakeholder-comment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../stakeholder-comment.test-samples';

import { StakeholderCommentService, RestStakeholderComment } from './stakeholder-comment.service';

const requireRestSample: RestStakeholderComment = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
};

describe('StakeholderComment Service', () => {
  let service: StakeholderCommentService;
  let httpMock: HttpTestingController;
  let expectedResult: IStakeholderComment | IStakeholderComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StakeholderCommentService);
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

    it('should create a StakeholderComment', () => {
      const stakeholderComment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(stakeholderComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StakeholderComment', () => {
      const stakeholderComment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(stakeholderComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StakeholderComment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StakeholderComment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StakeholderComment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStakeholderCommentToCollectionIfMissing', () => {
      it('should add a StakeholderComment to an empty array', () => {
        const stakeholderComment: IStakeholderComment = sampleWithRequiredData;
        expectedResult = service.addStakeholderCommentToCollectionIfMissing([], stakeholderComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stakeholderComment);
      });

      it('should not add a StakeholderComment to an array that contains it', () => {
        const stakeholderComment: IStakeholderComment = sampleWithRequiredData;
        const stakeholderCommentCollection: IStakeholderComment[] = [
          {
            ...stakeholderComment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStakeholderCommentToCollectionIfMissing(stakeholderCommentCollection, stakeholderComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StakeholderComment to an array that doesn't contain it", () => {
        const stakeholderComment: IStakeholderComment = sampleWithRequiredData;
        const stakeholderCommentCollection: IStakeholderComment[] = [sampleWithPartialData];
        expectedResult = service.addStakeholderCommentToCollectionIfMissing(stakeholderCommentCollection, stakeholderComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stakeholderComment);
      });

      it('should add only unique StakeholderComment to an array', () => {
        const stakeholderCommentArray: IStakeholderComment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stakeholderCommentCollection: IStakeholderComment[] = [sampleWithRequiredData];
        expectedResult = service.addStakeholderCommentToCollectionIfMissing(stakeholderCommentCollection, ...stakeholderCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stakeholderComment: IStakeholderComment = sampleWithRequiredData;
        const stakeholderComment2: IStakeholderComment = sampleWithPartialData;
        expectedResult = service.addStakeholderCommentToCollectionIfMissing([], stakeholderComment, stakeholderComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stakeholderComment);
        expect(expectedResult).toContain(stakeholderComment2);
      });

      it('should accept null and undefined values', () => {
        const stakeholderComment: IStakeholderComment = sampleWithRequiredData;
        expectedResult = service.addStakeholderCommentToCollectionIfMissing([], null, stakeholderComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stakeholderComment);
      });

      it('should return initial array if no StakeholderComment is added', () => {
        const stakeholderCommentCollection: IStakeholderComment[] = [sampleWithRequiredData];
        expectedResult = service.addStakeholderCommentToCollectionIfMissing(stakeholderCommentCollection, undefined, null);
        expect(expectedResult).toEqual(stakeholderCommentCollection);
      });
    });

    describe('compareStakeholderComment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStakeholderComment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStakeholderComment(entity1, entity2);
        const compareResult2 = service.compareStakeholderComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStakeholderComment(entity1, entity2);
        const compareResult2 = service.compareStakeholderComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStakeholderComment(entity1, entity2);
        const compareResult2 = service.compareStakeholderComment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProjectOwner } from '../project-owner.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../project-owner.test-samples';

import { ProjectOwnerService } from './project-owner.service';

const requireRestSample: IProjectOwner = {
  ...sampleWithRequiredData,
};

describe('ProjectOwner Service', () => {
  let service: ProjectOwnerService;
  let httpMock: HttpTestingController;
  let expectedResult: IProjectOwner | IProjectOwner[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectOwnerService);
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

    it('should create a ProjectOwner', () => {
      const projectOwner = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(projectOwner).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectOwner', () => {
      const projectOwner = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(projectOwner).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectOwner', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectOwner', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProjectOwner', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProjectOwnerToCollectionIfMissing', () => {
      it('should add a ProjectOwner to an empty array', () => {
        const projectOwner: IProjectOwner = sampleWithRequiredData;
        expectedResult = service.addProjectOwnerToCollectionIfMissing([], projectOwner);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectOwner);
      });

      it('should not add a ProjectOwner to an array that contains it', () => {
        const projectOwner: IProjectOwner = sampleWithRequiredData;
        const projectOwnerCollection: IProjectOwner[] = [
          {
            ...projectOwner,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProjectOwnerToCollectionIfMissing(projectOwnerCollection, projectOwner);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectOwner to an array that doesn't contain it", () => {
        const projectOwner: IProjectOwner = sampleWithRequiredData;
        const projectOwnerCollection: IProjectOwner[] = [sampleWithPartialData];
        expectedResult = service.addProjectOwnerToCollectionIfMissing(projectOwnerCollection, projectOwner);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectOwner);
      });

      it('should add only unique ProjectOwner to an array', () => {
        const projectOwnerArray: IProjectOwner[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const projectOwnerCollection: IProjectOwner[] = [sampleWithRequiredData];
        expectedResult = service.addProjectOwnerToCollectionIfMissing(projectOwnerCollection, ...projectOwnerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectOwner: IProjectOwner = sampleWithRequiredData;
        const projectOwner2: IProjectOwner = sampleWithPartialData;
        expectedResult = service.addProjectOwnerToCollectionIfMissing([], projectOwner, projectOwner2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectOwner);
        expect(expectedResult).toContain(projectOwner2);
      });

      it('should accept null and undefined values', () => {
        const projectOwner: IProjectOwner = sampleWithRequiredData;
        expectedResult = service.addProjectOwnerToCollectionIfMissing([], null, projectOwner, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectOwner);
      });

      it('should return initial array if no ProjectOwner is added', () => {
        const projectOwnerCollection: IProjectOwner[] = [sampleWithRequiredData];
        expectedResult = service.addProjectOwnerToCollectionIfMissing(projectOwnerCollection, undefined, null);
        expect(expectedResult).toEqual(projectOwnerCollection);
      });
    });

    describe('compareProjectOwner', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProjectOwner(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProjectOwner(entity1, entity2);
        const compareResult2 = service.compareProjectOwner(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProjectOwner(entity1, entity2);
        const compareResult2 = service.compareProjectOwner(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProjectOwner(entity1, entity2);
        const compareResult2 = service.compareProjectOwner(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

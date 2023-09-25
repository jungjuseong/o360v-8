import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProjectGoal } from '../project-goal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../project-goal.test-samples';

import { ProjectGoalService } from './project-goal.service';

const requireRestSample: IProjectGoal = {
  ...sampleWithRequiredData,
};

describe('ProjectGoal Service', () => {
  let service: ProjectGoalService;
  let httpMock: HttpTestingController;
  let expectedResult: IProjectGoal | IProjectGoal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectGoalService);
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

    it('should create a ProjectGoal', () => {
      const projectGoal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(projectGoal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectGoal', () => {
      const projectGoal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(projectGoal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectGoal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectGoal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProjectGoal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProjectGoalToCollectionIfMissing', () => {
      it('should add a ProjectGoal to an empty array', () => {
        const projectGoal: IProjectGoal = sampleWithRequiredData;
        expectedResult = service.addProjectGoalToCollectionIfMissing([], projectGoal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectGoal);
      });

      it('should not add a ProjectGoal to an array that contains it', () => {
        const projectGoal: IProjectGoal = sampleWithRequiredData;
        const projectGoalCollection: IProjectGoal[] = [
          {
            ...projectGoal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProjectGoalToCollectionIfMissing(projectGoalCollection, projectGoal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectGoal to an array that doesn't contain it", () => {
        const projectGoal: IProjectGoal = sampleWithRequiredData;
        const projectGoalCollection: IProjectGoal[] = [sampleWithPartialData];
        expectedResult = service.addProjectGoalToCollectionIfMissing(projectGoalCollection, projectGoal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectGoal);
      });

      it('should add only unique ProjectGoal to an array', () => {
        const projectGoalArray: IProjectGoal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const projectGoalCollection: IProjectGoal[] = [sampleWithRequiredData];
        expectedResult = service.addProjectGoalToCollectionIfMissing(projectGoalCollection, ...projectGoalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectGoal: IProjectGoal = sampleWithRequiredData;
        const projectGoal2: IProjectGoal = sampleWithPartialData;
        expectedResult = service.addProjectGoalToCollectionIfMissing([], projectGoal, projectGoal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectGoal);
        expect(expectedResult).toContain(projectGoal2);
      });

      it('should accept null and undefined values', () => {
        const projectGoal: IProjectGoal = sampleWithRequiredData;
        expectedResult = service.addProjectGoalToCollectionIfMissing([], null, projectGoal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectGoal);
      });

      it('should return initial array if no ProjectGoal is added', () => {
        const projectGoalCollection: IProjectGoal[] = [sampleWithRequiredData];
        expectedResult = service.addProjectGoalToCollectionIfMissing(projectGoalCollection, undefined, null);
        expect(expectedResult).toEqual(projectGoalCollection);
      });
    });

    describe('compareProjectGoal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProjectGoal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProjectGoal(entity1, entity2);
        const compareResult2 = service.compareProjectGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProjectGoal(entity1, entity2);
        const compareResult2 = service.compareProjectGoal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProjectGoal(entity1, entity2);
        const compareResult2 = service.compareProjectGoal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

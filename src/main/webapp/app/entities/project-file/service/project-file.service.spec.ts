import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProjectFile } from '../project-file.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../project-file.test-samples';

import { ProjectFileService } from './project-file.service';

const requireRestSample: IProjectFile = {
  ...sampleWithRequiredData,
};

describe('ProjectFile Service', () => {
  let service: ProjectFileService;
  let httpMock: HttpTestingController;
  let expectedResult: IProjectFile | IProjectFile[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectFileService);
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

    it('should create a ProjectFile', () => {
      const projectFile = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(projectFile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectFile', () => {
      const projectFile = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(projectFile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectFile', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectFile', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProjectFile', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProjectFileToCollectionIfMissing', () => {
      it('should add a ProjectFile to an empty array', () => {
        const projectFile: IProjectFile = sampleWithRequiredData;
        expectedResult = service.addProjectFileToCollectionIfMissing([], projectFile);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectFile);
      });

      it('should not add a ProjectFile to an array that contains it', () => {
        const projectFile: IProjectFile = sampleWithRequiredData;
        const projectFileCollection: IProjectFile[] = [
          {
            ...projectFile,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProjectFileToCollectionIfMissing(projectFileCollection, projectFile);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectFile to an array that doesn't contain it", () => {
        const projectFile: IProjectFile = sampleWithRequiredData;
        const projectFileCollection: IProjectFile[] = [sampleWithPartialData];
        expectedResult = service.addProjectFileToCollectionIfMissing(projectFileCollection, projectFile);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectFile);
      });

      it('should add only unique ProjectFile to an array', () => {
        const projectFileArray: IProjectFile[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const projectFileCollection: IProjectFile[] = [sampleWithRequiredData];
        expectedResult = service.addProjectFileToCollectionIfMissing(projectFileCollection, ...projectFileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectFile: IProjectFile = sampleWithRequiredData;
        const projectFile2: IProjectFile = sampleWithPartialData;
        expectedResult = service.addProjectFileToCollectionIfMissing([], projectFile, projectFile2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectFile);
        expect(expectedResult).toContain(projectFile2);
      });

      it('should accept null and undefined values', () => {
        const projectFile: IProjectFile = sampleWithRequiredData;
        expectedResult = service.addProjectFileToCollectionIfMissing([], null, projectFile, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectFile);
      });

      it('should return initial array if no ProjectFile is added', () => {
        const projectFileCollection: IProjectFile[] = [sampleWithRequiredData];
        expectedResult = service.addProjectFileToCollectionIfMissing(projectFileCollection, undefined, null);
        expect(expectedResult).toEqual(projectFileCollection);
      });
    });

    describe('compareProjectFile', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProjectFile(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProjectFile(entity1, entity2);
        const compareResult2 = service.compareProjectFile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProjectFile(entity1, entity2);
        const compareResult2 = service.compareProjectFile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProjectFile(entity1, entity2);
        const compareResult2 = service.compareProjectFile(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

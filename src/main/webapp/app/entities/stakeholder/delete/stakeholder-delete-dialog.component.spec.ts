jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StakeholderService } from '../service/stakeholder.service';

import { StakeholderDeleteDialogComponent } from './stakeholder-delete-dialog.component';

describe('Stakeholder Management Delete Component', () => {
  let comp: StakeholderDeleteDialogComponent;
  let fixture: ComponentFixture<StakeholderDeleteDialogComponent>;
  let service: StakeholderService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StakeholderDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(StakeholderDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StakeholderDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StakeholderService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});

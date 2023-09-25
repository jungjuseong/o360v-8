import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IAudience } from 'app/entities/audience/audience.model';
import { AudienceService } from 'app/entities/audience/service/audience.service';
import { ChannelService } from '../service/channel.service';
import { IChannel } from '../channel.model';
import { ChannelFormService } from './channel-form.service';

import { ChannelUpdateComponent } from './channel-update.component';

describe('Channel Management Update Component', () => {
  let comp: ChannelUpdateComponent;
  let fixture: ComponentFixture<ChannelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let channelFormService: ChannelFormService;
  let channelService: ChannelService;
  let audienceService: AudienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ChannelUpdateComponent],
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
      .overrideTemplate(ChannelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChannelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    channelFormService = TestBed.inject(ChannelFormService);
    channelService = TestBed.inject(ChannelService);
    audienceService = TestBed.inject(AudienceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Audience query and add missing value', () => {
      const channel: IChannel = { id: 456 };
      const audience: IAudience = { id: 7959 };
      channel.audience = audience;

      const audienceCollection: IAudience[] = [{ id: 20987 }];
      jest.spyOn(audienceService, 'query').mockReturnValue(of(new HttpResponse({ body: audienceCollection })));
      const additionalAudiences = [audience];
      const expectedCollection: IAudience[] = [...additionalAudiences, ...audienceCollection];
      jest.spyOn(audienceService, 'addAudienceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ channel });
      comp.ngOnInit();

      expect(audienceService.query).toHaveBeenCalled();
      expect(audienceService.addAudienceToCollectionIfMissing).toHaveBeenCalledWith(
        audienceCollection,
        ...additionalAudiences.map(expect.objectContaining),
      );
      expect(comp.audiencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const channel: IChannel = { id: 456 };
      const audience: IAudience = { id: 292 };
      channel.audience = audience;

      activatedRoute.data = of({ channel });
      comp.ngOnInit();

      expect(comp.audiencesSharedCollection).toContain(audience);
      expect(comp.channel).toEqual(channel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChannel>>();
      const channel = { id: 123 };
      jest.spyOn(channelFormService, 'getChannel').mockReturnValue(channel);
      jest.spyOn(channelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ channel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: channel }));
      saveSubject.complete();

      // THEN
      expect(channelFormService.getChannel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(channelService.update).toHaveBeenCalledWith(expect.objectContaining(channel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChannel>>();
      const channel = { id: 123 };
      jest.spyOn(channelFormService, 'getChannel').mockReturnValue({ id: null });
      jest.spyOn(channelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ channel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: channel }));
      saveSubject.complete();

      // THEN
      expect(channelFormService.getChannel).toHaveBeenCalled();
      expect(channelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChannel>>();
      const channel = { id: 123 };
      jest.spyOn(channelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ channel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(channelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAudience', () => {
      it('Should forward to audienceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(audienceService, 'compareAudience');
        comp.compareAudience(entity, entity2);
        expect(audienceService.compareAudience).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

import { LanguageSelectorPage } from './language-selector.page';
import { LangChangeEvent, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { EventEmitter } from '@angular/core';

const translateServiceMock = {
    currentLang: 'de',
    onLangChange: new EventEmitter<LangChangeEvent>(),
    use: jest.fn(),
    get: jest.fn().mockImplementation((key: string): Observable<string> => {
      return of(key);
    }),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

describe('LanguageSelectorPage', () => {
  let fixture: ComponentFixture<LanguageSelectorPage>;
  let component: LanguageSelectorPage;
  let storageService: jest.Mocked<any>;

  beforeEach(async () => {

    storageService = {
      get: jest.fn().mockResolvedValue('es'),
      set: jest.fn(),
    };

    await TestBed.configureTestingModule({
        declarations:[TranslatePipe],
        imports:[TranslateModule.forRoot(),],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: StorageService, useValue: storageService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with the correct language from storage', async () => {
    await fixture.whenStable(); 
    expect(storageService.get).toHaveBeenCalledWith('language');
    expect(translateServiceMock.currentLang).toBe('de');
  });

  it('should change language when a new language is selected', async () => {
    await fixture.whenStable();
    
    component.languageChange({code:'ca'});

    expect(translateServiceMock.use).toHaveBeenCalledWith('ca');
    expect(storageService.set).toHaveBeenCalledWith('language', 'ca');
  });

  it('should set default language to Català when no language is set', () => {
    (translateServiceMock as any).currentLang = undefined;
    component.ngOnInit();

    expect(component.selected.code).toBe('ca');
  });
  
  it('should map the correct language based on the current language code', () => {
    component.languages.next('es');
    const lang = component.languageList.find((language) => language.code === 'es');
    
    component.languageSelected.subscribe((selectedLang) => {
      expect(selectedLang).toEqual(lang);
    });
  });
});

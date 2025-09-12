import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';
import { ArtService } from '../services/art.service';
import { NotificationService } from '../services/notification.service';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['getSearch']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['initializeUser']);
    const artServiceSpy = jasmine.createSpyObj('ArtService', ['getArtistInfo', 'getArtistArtworks']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ArtService, useValue: artServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search term', () => {
    expect(component.searchTerm).toBe('');
  });

  it('should call search service when searching', () => {
    component.searchTerm = 'test';
    const mockEvent = new Event('submit');
    component.onSearch(mockEvent);
    expect(searchService.getSearch).toHaveBeenCalledWith('test');
  });

  it('should not search with empty query', () => {
    component.searchTerm = '';
    const mockEvent = new Event('submit');
    component.onSearch(mockEvent);
    expect(searchService.getSearch).not.toHaveBeenCalled();
  });
});

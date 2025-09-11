import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchService } from '../services/search.service';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['searchArtists']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent, HttpClientTestingModule],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy }
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

  it('should initialize with empty search query', () => {
    expect(component.searchQuery).toBe('');
  });

  it('should call search service when searching', () => {
    component.searchQuery = 'test';
    component.search();
    expect(searchService.searchArtists).toHaveBeenCalledWith('test');
  });

  it('should not search with empty query', () => {
    component.searchQuery = '';
    component.search();
    expect(searchService.searchArtists).not.toHaveBeenCalled();
  });
});

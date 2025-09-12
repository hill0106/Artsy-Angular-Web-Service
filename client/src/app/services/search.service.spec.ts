import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search artists', () => {
    const mockResponse = {
      _embedded: {
        results: [
          { id: '1', name: 'Test Artist' }
        ]
      }
    };

    service.getSearch('test').subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/search?q=test');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle search errors', () => {
    service.getSearch('test').subscribe({
      next: () => fail('should have failed'),
      error: (error: any) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/search?q=test');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});

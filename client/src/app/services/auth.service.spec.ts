import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user', () => {
    const mockResponse = { token: 'test-token', user: { id: '1', username: 'test' } };
    const credentials = { email: 'test@example.com', password: 'password' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should register user', () => {
    const mockResponse = { message: 'User created successfully' };
    const userData = { 
      username: 'test', 
      email: 'test@example.com', 
      password: 'password' 
    };

    service.register(userData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush(mockResponse);
  });

  it('should logout user', () => {
    service.logout().subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});

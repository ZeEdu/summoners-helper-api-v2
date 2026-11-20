import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Home } from './home'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'

describe('Home', () => {
  let httpTesting: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents()

    httpTesting = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTesting.verify()
  })

  it('should create', () => {
    const fixture = TestBed.createComponent(Home)
    fixture.detectChanges()

    const firstRequest = httpTesting.expectOne((request) => {
      return request.url === 'http://localhost:3000/api/report/count?type=GUIDE&actionTaken=WAITING'
    })

    expect(firstRequest.request.method).toBe('GET')
    firstRequest.flush(0)

    const secondRequest = httpTesting.expectOne((request) => {
      return (
        request.url === 'http://localhost:3000/api/report/count?type=COMMENT&actionTaken=WAITING'
      )
    })

    expect(secondRequest.request.method).toBe('GET')
    secondRequest.flush(0)

    expect(fixture.componentInstance).toBeTruthy()
  })
})

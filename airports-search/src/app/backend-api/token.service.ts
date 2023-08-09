import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { CLIENT_ID, CLIENT_SECRET } from 'src/environments/env';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    constructor(private http: HttpClient) { }

    getNewToken() {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      const body = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

      return this.http.post<unknown>('https://test.api.amadeus.com/v1/security/oauth2/token', body, { headers })
        .pipe(
          map((res: any) => res.access_token),
          catchError(() => { throw Error('Token refresh error.') })
        )
    }
}

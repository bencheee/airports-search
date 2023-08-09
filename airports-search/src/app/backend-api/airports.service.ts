import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AllAirportsResponse, SingleAirportResponse } from './interfaces.i';

@Injectable({
	providedIn: 'root'
})
export class AirportsService {

	constructor(private http: HttpClient) { }

	getAirportLocations(query: string) {
		const token = sessionStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		return this.http.get<AllAirportsResponse>(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${query}&page[limit]=5`, { headers });
	}

	getSingleAirport(id: string) {
		const token = sessionStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		return this.http.get<SingleAirportResponse>(`https://test.api.amadeus.com/v1/reference-data/locations/${id}`, { headers });
	}
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AllAirportsResponse, SingleAirportResponse, TopAirport } from './interfaces.i';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AirportsService {

	constructor(private http: HttpClient) { }

	public getTopAirports = new BehaviorSubject<TopAirport[]>(JSON.parse(localStorage.getItem('topAirports')!));
	
	getAirportLocations(query: string) {
		const token = sessionStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		return this.http.get<AllAirportsResponse>(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${query}&page[limit]=5`, { headers })
			.pipe(
				tap(res => {
					const topAirports: TopAirport[] = JSON.parse(localStorage.getItem('topAirports')!) ?? [];
					
					res.data.forEach(airport => {
						const topAirportIndex = topAirports.findIndex(topAirport => topAirport.id === airport.id);

						if (topAirportIndex === -1) {
							topAirports.push({ id: airport.id, detailedName: airport.detailedName, count: 1 });
						} else {
							topAirports[topAirportIndex].count++;
						}
					});

					topAirports.sort((a, b) => b.count - a.count);
					localStorage.setItem('topAirports', JSON.stringify(topAirports));
					this.getTopAirports.next(topAirports);
				}),
				map(res => {
					res.data.map(airport => {
						airport.topTen = !!JSON.parse(localStorage.getItem('topAirports')!)
							.slice(0, 10)
							.filter((topAirport: TopAirport) => topAirport.id === airport.id).length;
					})
					return res;
				})
			);
	}

	getSingleAirport(id: string) {
		const token = sessionStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		return this.http.get<SingleAirportResponse>(`https://test.api.amadeus.com/v1/reference-data/locations/${id}`, { headers });
	}
}

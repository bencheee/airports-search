import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription, concatMap, debounceTime, distinctUntilChanged, fromEvent, map, of, tap } from 'rxjs';

import { AirportsService } from '../backend-api/airports.service';
import { AirportDetails, TopAirport } from '../backend-api/interfaces.i';
import { WarningMessages } from '../constants';

@Component({
	selector: 'app-airport-search',
	templateUrl: './airport-search.component.html',
	styleUrls: ['./airport-search.component.scss']
})
export class AirportSearchComponent implements OnInit, OnDestroy {

	private getAirportDetails!: Subscription;
	private getTopTenAirports!: Subscription;

	protected airports: AirportDetails[] | undefined = undefined;
	protected isSearching = false;
	protected warningMessage: string | null = WarningMessages.EmptyQuery;
	protected topTenAirports?: TopAirport[];

	@ViewChild('textInput', { static: true }) private textInput!: ElementRef<HTMLInputElement>;

	constructor(private airportsService: AirportsService) { }

	ngOnInit() {
		this.getAirportDetails = fromEvent(this.textInput.nativeElement, 'input')
			.pipe(
				map((event) => (event.target as HTMLInputElement).value),
				debounceTime(300),
				distinctUntilChanged(),
				tap(() => this.isSearching = true),
				concatMap(searchQuery => {
					if (searchQuery.length) {
						return this.airportsService.getAirportLocations(searchQuery);
					}
					return of(undefined);
				}),
				tap(() => this.isSearching = false),
			)
			.subscribe(airportDetails => {
				this.airports = airportDetails?.data;
				this.warningMessage = airportDetails ? (airportDetails.data.length ? null : WarningMessages.NoResults) : WarningMessages.EmptyQuery;
			})

		this.getTopTenAirports = this.airportsService.getTopAirports.subscribe(topAirports => {
			this.topTenAirports = topAirports?.slice(0, 10);
		});
	}

	ngOnDestroy() {
		this.getAirportDetails.unsubscribe();
		this.getTopTenAirports.unsubscribe();
	}
}

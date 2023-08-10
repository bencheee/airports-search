import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription, concatMap, debounceTime, distinctUntilChanged, fromEvent, map, of, tap } from 'rxjs';

import { AirportsService } from '../backend-api/airports.service';
import { AirportDetails } from '../backend-api/interfaces.i';
import { WarningMessages } from '../constants';

@Component({
	selector: 'app-airport-search',
	templateUrl: './airport-search.component.html',
	styleUrls: ['./airport-search.component.scss']
})
export class AirportSearchComponent implements OnInit, OnDestroy {

	private subscription!: Subscription;

	protected airports: AirportDetails[] | undefined = undefined;
	protected isSearching = false;
	protected warningMessage: string | null = WarningMessages.EmptyQuery;

	@ViewChild('textInput', { static: true }) private textInput!: ElementRef<HTMLInputElement>;

	constructor(private airportsService: AirportsService) { }

	ngOnInit() {
		this.subscription = fromEvent(this.textInput.nativeElement, 'input')
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
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

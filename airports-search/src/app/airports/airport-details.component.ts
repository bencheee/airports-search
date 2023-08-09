import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subscription, concatMap, of, tap } from 'rxjs';

import { AirportsService } from '../backend-api/airports.service';
import { AirportDetails } from '../backend-api/interfaces.i';

@Component({
	selector: 'app-airport-details',
	templateUrl: './airport-details.component.html',
	styleUrls: ['./airport-details.component.scss'],
})
export class AirportDetailsComponent implements OnInit, OnDestroy {

	private id!: string;
	private subscription!: Subscription;

	protected airportDetails!: AirportDetails;
	protected formSaved = false;
	protected form = this.fb.group({
		cityCode: [{ value: '', disabled: true }, Validators.required],
		countryName: [{ value: '', disabled: true }, Validators.required],
		customLabel: '',
		id: [{ value: '', disabled: true }, Validators.required],
		name: [{ value: '', disabled: true }, Validators.required],
		regionCode: [{ value: '', disabled: true }, Validators.required],
		score: [0, Validators.required],
	});

	constructor(
		private airportsService: AirportsService,
		private fb: FormBuilder,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.subscription = this.route.params
			.pipe(
				tap((params) => (this.id = params['id'])),
				concatMap((params) => {
					if (localStorage.getItem(params['id'])) {
						return of(JSON.parse(localStorage.getItem(params['id'])!));
					}
					return this.airportsService.getSingleAirport(params['id']);
				}),
				tap((airport) => {
					this.airportDetails = airport.data;
					this.populateForm(this.airportDetails);
				})
			)
			.subscribe();
	}

	private populateForm(airport: AirportDetails) {
		this.form.patchValue({
			cityCode: airport.address.cityCode,
			countryName: airport.address.countryName,
			customLabel: airport.customLabel,
			id: airport.id,
			name: airport.name,
			regionCode: airport.address.regionCode,
			score: airport.analytics?.travelers.score
		});
	}

	protected onSubmit() {
		if (this.form.valid) {
			const formData = this.form.getRawValue();
			const updatedAirportDetails = {
				...this.airportDetails,
				id: formData.id!,
				name: formData.name!,
				address: {
					...this.airportDetails.address,
					cityCode: formData.cityCode!,
					countryName: formData.countryName!,
					regionCode: formData.regionCode!,
				},
				customLabel: formData.customLabel!,
				analytics: {
					travelers: {
						score: formData.score!,
					},
				},
			};

			localStorage.setItem(this.id, JSON.stringify({ data: updatedAirportDetails }));
			this.formSaved = true;
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

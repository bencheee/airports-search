import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AirportDetailsComponent } from './airport-details.component';
import { AirportSearchComponent } from './airport-search.component';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule
	],
	exports: [
		AirportDetailsComponent,
		AirportSearchComponent
	],
	declarations: [
		AirportDetailsComponent,
		AirportSearchComponent
	]
})
export class AirportsModule {
}

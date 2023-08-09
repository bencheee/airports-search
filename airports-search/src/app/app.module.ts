import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AirportsModule } from './airports/airports.module';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		AirportsModule,
		HttpClientModule
	],
	providers: [
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

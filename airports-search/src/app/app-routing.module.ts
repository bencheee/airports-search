import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirportSearchComponent } from './airports/airport-search.component';
import { AirportDetailsComponent } from './airports/airport-details.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: AirportSearchComponent,
			},
			{
				path: 'details/:id',
				component: AirportDetailsComponent,
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

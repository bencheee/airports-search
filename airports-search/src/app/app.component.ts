import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { TokenService } from './backend-api/token.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

	private subscription!: Subscription;

	constructor(private tokenService: TokenService) { }

	// Budući da token za API ističe svakih 30 min koristio sam session storage kao brzi fix, te se generira novi token pri svakom pokretanju aplikacije.
	// U 'pravom' projektu vjerojatno bih koristio cron job za automatsko refreshanje tokena na serveru.

	ngOnInit() {
		this.subscription = this.tokenService.getNewToken().subscribe(token => {
			sessionStorage.setItem('token', token);
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

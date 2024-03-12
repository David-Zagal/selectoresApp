import { Component, OnInit } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from './../../services/countries.service';
import { Region, SmallCountry } from './../../interfaces/country.interfaces';

@Component({
	selector: 'country-selector-page',
	templateUrl: './selector-page.component.html',
	styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

	constructor (private fb: FormBuilder, private countriesService: CountriesService) {}

	ngOnInit (): void {
		this.onRegionChanged ();
		this.onCountryChanged ();
	}

	public myform: FormGroup = this.fb.group ({
		region: ['', Validators.required],
		country: ['', Validators.required],
		border: ['', Validators.required],
	});

	public countriesByRegion: SmallCountry[] = [];
	public bordersBycountry: SmallCountry[] = [];

	get regions (): Region[] {
		return this.countriesService.regions;
	}

	onRegionChanged (): void {
		this.myform.get ('region')!.valueChanges.pipe (
			tap (() => this.myform.get ('country')!.setValue ('')),
			tap (() => this.bordersBycountry = []),
			switchMap (region => this.countriesService.getCountriesByRegion (region)),
		).subscribe (countries => this.countriesByRegion = countries);
	}

	onCountryChanged (): void {
		this.myform.get ('country')!.valueChanges.pipe (
			tap (() => this.myform.get ('border')!.setValue ('')),
			filter ((value: string) => value.length > 0),
			switchMap (alphaCode => this.countriesService.getCountryByAlphaCode (alphaCode)),
			switchMap (country => this.countriesService.getCountryBordersByCodes (country.borders)),
		).subscribe (countries => this.bordersBycountry = countries);
		// ).subscribe (country => this.bordersBycountry = country); //console.log ({ borders: country.borders }));
	}
}
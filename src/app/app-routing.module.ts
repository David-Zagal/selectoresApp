import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'selector',
		loadChildren: () => import ('./country/countries.module').then (m => m.CountriesModule),
	},
	{
		path: '**',
		redirectTo: 'selector'
	}
];

@NgModule({
	imports: [RouterModule.forRoot (routes, { useHash: true, })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
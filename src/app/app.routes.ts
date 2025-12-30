import { Routes } from '@angular/router';
import { TimerPage } from './pages/TimerPage/TimerPage';
import { IntervalBuilderPage } from './pages/IntervalBuilderPage/IntervalBuilderPage';

export const appRoutes: Routes = [
	{
		path: 'timer',
		component: TimerPage,
		title: 'Timer',
	},
	{
		path: 'interval-builder',
		component: IntervalBuilderPage,
		title: 'Interval builder',
	},
	{
		path: '**',
		redirectTo: '/timer'
	},
]
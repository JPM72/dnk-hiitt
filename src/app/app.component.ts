import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { RouterModule } from '@angular/router'
import { Howler } from 'howler'
import { NavBar } from '@/libs/ui/components/NavBar/NavBar'

@Component({
	imports: [RouterModule, NavBar],
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit
{
	title = 'dnk-hiitt';

	ngOnInit(): void
	{
		document.addEventListener('touchend', function ()
		{
			// Check and resume the global Howler audio context
			if (Howler.ctx && Howler.ctx.state !== 'running')
			{
				console.warn('Resuming global Howler audio context')
				Howler.ctx.resume()
			}
		}, true);

	}
}

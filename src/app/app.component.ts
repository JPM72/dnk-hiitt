import { Component, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TimerProgressBarComponent } from 'src/libs/ui/components'
import { Howler } from 'howler'

@Component({
	imports: [TimerProgressBarComponent, RouterModule],
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
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

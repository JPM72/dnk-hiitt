import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimerProgressBarComponent } from 'src/libs/ui/components';

@Component({
	imports: [TimerProgressBarComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dnk-hiitt';
}

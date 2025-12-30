import { Component, OnDestroy, inject } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { MatButton, MatIconButton } from '@angular/material/button'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { appRoutes } from '@/app/app.routes'
import { appMeta } from '@/app/app.meta'

@Component({
	selector: 'app-nav-bar',
	imports: [
		MatButton,
		MatIconButton,
		RouterLink,
		RouterLinkActive,
		NgTemplateOutlet,
	],
	templateUrl: './NavBar.html',
	styleUrl: './NavBar.scss',
})
export class NavBar
{
	get appRoutes() { return appRoutes.slice(0, -1) }
	get gitHubLink() { return appMeta.gitHubLink }
}

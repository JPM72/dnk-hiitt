import { Injectable, OnDestroy } from '@angular/core'

@Injectable({
	providedIn: 'root'
})
export class WakeLockService implements OnDestroy
{
	private instance: WakeLockSentinel | null = null
	private supported: boolean
	constructor()
	{
		this.supported = 'wakeLock' in navigator
	}

	request()
	{
		if (!this.supported)
		{
			console.warn('Wake Lock API is not supported in this browser')
			return Promise.resolve(false)
		}

		return navigator.wakeLock.request('screen').then(sentinel =>
		{
			this.instance = sentinel
			this.instance.addEventListener('release', () =>
			{
				this.instance = null
			})

			// Handle visibility change events (e.g., when the page goes to background)
			document.addEventListener('visibilitychange', this.handleVisibilityChange)
			return true
		}).catch(error =>
		{
			console.error('Failed to request wake lock:', error)
			return false
		})
	}

	release()
	{
		if (!this.instance) return Promise.resolve(true)
		return this.instance.release().then(() =>
		{
			this.instance = null
			return true
		}).catch(error =>
		{
			console.error('Failed to release wake lock:', error)
			return false
		})
	}

	/**
	 * Handle visibility change events to reacquire wake lock when the page becomes visible again
	 */
	private handleVisibilityChange = async (): Promise<void> =>
	{
		if (this.instance !== null && document.visibilityState === 'visible')
		{
			try
			{
				this.instance = await navigator.wakeLock.request('screen')
			} catch (error)
			{
				console.error('Failed to reacquire wake lock:', error)
			}
		}
	};

	/**
	 * Clean up event listeners and release wake lock when service is destroyed
	 */
	ngOnDestroy(): void
	{
		document.removeEventListener('visibilitychange', this.handleVisibilityChange)
		if (this.instance)
		{
			this.instance.release()
				.catch((error) => console.error('Failed to release wake lock on destroy:', error))
		}
	}
}
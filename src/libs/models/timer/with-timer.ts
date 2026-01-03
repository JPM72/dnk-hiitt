import { TICK_INTERVAL } from '@/app/app.constants'
import { decomposeDuration, formatTime } from '@/libs/utils'
import { computed } from '@angular/core'
import
{
	patchState,
	signalStoreFeature,
	withComputed,
	withMethods,
	withState
} from '@ngrx/signals'
import type { TimerModel } from './timer.model'

const initialState = (): TimerModel => ({
	startTime: null,
	elapsedTime: null,
	accumulatedTime: null,
	intervalId: null,
})

export function withTimer()
{
	return signalStoreFeature(
		withState(initialState),
		withComputed(({
			elapsedTime, accumulatedTime, intervalId,
		}) => ({
			isPaused: computed(() => typeof intervalId() !== 'number'),
			currentTime: computed(() => accumulatedTime() + (elapsedTime() ?? 0)),
		})),
		withComputed(({ currentTime }) => ({
			currentIntervals: computed(() => decomposeDuration(currentTime())),
		})),
		withComputed(({ currentIntervals }) => ({
			timeText: computed(() => formatTime(currentIntervals())),
		})),
		withMethods(store => ({
			tick(): void
			{
				patchState(store, ({ startTime }) =>
				{
					if (store.isPaused()) return {}
					return {
						elapsedTime: startTime
							? performance.now() - (startTime ?? 0)
							: null,
					}
				})
			},
			updateIntervalId(...args: Parameters<typeof setInterval> | []): void
			{
				patchState(store, ({ intervalId }) =>
				{
					clearInterval(intervalId)
					if (args.length)
					{
						/**
						 * .call used to circumvent type incompatbility
						 * with @types/node/web-globals
						 */
						return { intervalId: setInterval.call(null, ...args) }
					} else
					{
						return { intervalId: null }
					}
				})
			},
			start(): void
			{
				patchState(store, {
					startTime: performance.now(),
				})
				this.updateIntervalId(() => this.tick(), TICK_INTERVAL)
			},
			pause(): void
			{
				this.updateIntervalId()
				patchState(store, ({ elapsedTime, accumulatedTime }) => ({
					startTime: null,
					accumulatedTime: accumulatedTime + (elapsedTime ?? 0),
					elapsedTime: null,
				}))
			},
			stop(): void
			{
				this.pause()
				patchState(store, {
					accumulatedTime: null,
				})
			},
			play(): void
			{
				if (store.intervalId())
				{
					this.pause()
				} else this.start()
			},
		})),
	)
}
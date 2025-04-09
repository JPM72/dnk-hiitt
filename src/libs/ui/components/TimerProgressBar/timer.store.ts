import _ from 'lodash'
import { computed } from '@angular/core'
import { patchState, signalStore, withState, withComputed, withMethods } from '@ngrx/signals'

type TimerState = {
	startTime: number | null
	accumulatedTime: number
	elapsedTime: number | null
	intervalId: number | null
}

const initialState: TimerState = {
	startTime: null,
	accumulatedTime: 0,
	elapsedTime: null,
	intervalId: null,
}

const TICK_INTERVAL = 16
const { round } = Math
const setInterval = function (...args: Parameters<typeof window.setInterval>)
{
	return window.setInterval(...args) as unknown as number
}

const throttle = _.throttle((...args) => console.log(...args), 100)

export const TimerStore = signalStore(
	withState(initialState),
	withComputed(({ elapsedTime, accumulatedTime, intervalId }) => ({
		isPaused: computed(() => typeof intervalId() !== 'number'),
		currentTime: computed(() => accumulatedTime() + (elapsedTime() ?? 0))
	})),
	withComputed(({ currentTime }) => ({
		timeText: computed(() =>
		{
			const t = round(currentTime())

			const minutes = `${(t / 60000) | 0}`.padStart(2, '0')
			const seconds = `${(t / 1000) % 60 | 0}`.padStart(2, '0')
			const milliseconds = `${t % 1000}`.padStart(3, '0')
			return `${minutes}:${seconds}.${milliseconds}`
		}),
		progress: computed(() =>
		{
			return Math.min(
				100,
				_.round(100 * (currentTime() / 60000), 3)
			)
		}),
	})),
	withMethods(store =>
	({
		tick(): void
		{
			patchState(store, state =>
			{
				const s = {
					...state,
					isPaused: store.isPaused(),
					currentTime: store.currentTime(),
					progress: store.progress(),
				}
				throttle(s)
				if (store.isPaused()) return {}
				const { startTime } = state
				return {
					elapsedTime: startTime
						? performance.now() - (state.startTime ?? 0)
						: null
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
			patchState(store, { accumulatedTime: null })
		},
		play(): void
		{
			if (store.intervalId())
			{
				this.pause()
			} else this.start()
		},
	}))
)
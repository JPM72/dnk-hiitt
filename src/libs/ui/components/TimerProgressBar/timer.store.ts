import _ from 'lodash'
import { computed } from '@angular/core'
import { patchState, signalStore, withState, withComputed, withMethods } from '@ngrx/signals'
import { formatTime } from '@/libs/utils'

type TimerState = {
	startTime: number | null
	accumulatedTime: number
	elapsedTime: number | null
	intervalId: number | null
	minutes: number | null
	seconds: number | null
	rounds: number | null
	currentRound: number
	audioShouldPlay: boolean
}

const initialState: TimerState = {
	startTime: null,
	accumulatedTime: 0,
	elapsedTime: null,
	intervalId: null,
	minutes: null,
	seconds: null,
	rounds: null,
	currentRound: 0,
	audioShouldPlay: true,
}

const TICK_INTERVAL = 16
const setInterval = function (...args: Parameters<typeof window.setInterval>)
{
	return window.setInterval(...args) as unknown as number
}

const audioPlayer = {
	audio: new Audio('/sounds/beeping-5-countdown.mp3'),
	play()
	{
		this.audio.play()
	}
}

export const TimerStore = signalStore(
	withState(initialState),
	withComputed(({
		elapsedTime, accumulatedTime, intervalId,
		minutes, seconds,
	}) => ({
		isPaused: computed(() => typeof intervalId() !== 'number'),
		currentTime: computed(() => accumulatedTime() + (elapsedTime() ?? 0)),
		intervalDuration: computed(() => 1e3 * (60 * (minutes() ?? 0) + (seconds() ?? 0))),
	})),
	withComputed(({ currentTime, intervalDuration }) => ({
		timeText: computed(() => formatTime(currentTime())),
		progress: computed(() =>
		{
			const duration = intervalDuration()
			if (!duration) return 0
			return Math.min(
				100,
				_.round(100 * (currentTime() / duration), 3)
			)
		}),
	})),
	withMethods(store =>
	({
		tick(): void
		{
			patchState(store, state =>
			{
				if (store.isPaused()) return {}
				const { startTime } = state
				const current = store.currentTime()
				const intervalDuration = store.intervalDuration()

				let audioShouldPlay = state.audioShouldPlay

				if (audioShouldPlay && intervalDuration > 5e3)
				{
					if ((intervalDuration - current) <= 5e3)
					{
						audioPlayer.play()
						audioShouldPlay = false
					}
				}

				if (intervalDuration && current >= intervalDuration)
				{
					const currentRound = store.currentRound() + 1

					return {
						startTime: performance.now(),
						elapsedTime: null,
						accumulatedTime: 0,
						currentRound,
						audioShouldPlay: true,
					}
				} else
				{
					return {
						elapsedTime: startTime
							? performance.now() - (startTime ?? 0)
							: null,
						audioShouldPlay
					}
				}
			})

			const rounds = store.rounds()
			if (rounds && store.currentRound() >= rounds) this.stop()
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
		update(values: Partial<TimerState>)
		{
			patchState(store, values)
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
				currentRound: 0,
			})
		},
		play(): void
		{
			if (store.intervalId())
			{
				this.pause()
			} else this.start()
		},
		reset()
		{
			patchState(store, {
				minutes: null, seconds: null, rounds: null,
			})
		},
	}))
)
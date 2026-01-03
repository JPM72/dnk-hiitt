import _ from 'lodash'
import { computed } from '@angular/core'
import { signalStore, patchState, withState, withComputed, withMethods } from '@ngrx/signals'
import { formatTime, decomposeDuration } from '@/libs/utils'
import { Howl } from 'howler'
import type { TimerState } from './timer.model'
import type { AudioMarker } from '../audio-marker/audio-marker.model'
import { TICK_INTERVAL } from '@/app/app.constants'

const AUDIO_MARKERS = {
	kettlebell: [
		{
			offset: -30e3,
			options: { src: 'thirty.mp3', }
		},
		{
			offset: -15e3,
			options: { src: 'fifteen.mp3', }
		},
		{
			offset: -5e3,
			options: { src: 'beeping-5-countdown.mp3', }
		},
	],
	stepping: [
		{
			offset: -5e3,
			options: { src: 'beep.mp3', }
		},
	]
}

const BASE_AUDIO_MARKERS = [
	// ...AUDIO_MARKERS.kettlebell,
	...AUDIO_MARKERS.stepping,
]



const initialState: TimerState = {
	intervalDuration: null,
	startTime: null,
	accumulatedTime: 0,
	elapsedTime: null,
	intervalId: null,
	rounds: null,
	currentRound: 0,
	audioMarkers: [...BASE_AUDIO_MARKERS],
	audioVolume: 0.5,
}

const markerPlayer = {
	howl: null,
	stop()
	{
		const { howl } = this
		_.invoke(howl, 'stop')
		_.invoke(howl, 'unload')
		this.howl = null
	},
	play(name: string, volume = 1)
	{
		this.stop()
		this.howl = new Howl({
			src: [`/sounds/${name}`],
			html5: true,
			volume,

		})
		this.howl.play()
	},
	playMarker(marker: AudioMarker)
	{
		this.stop()
		this.howl = new Howl({
			volume: 1,
			...marker.options
		})
		this.howl.play()
	}
}

export const TimerStore = signalStore(
	withState(initialState),
	withComputed(({
		elapsedTime, accumulatedTime, intervalId,
	}) => ({
		isPaused: computed(() => typeof intervalId() !== 'number'),
		currentTime: computed(() => accumulatedTime() + (elapsedTime() ?? 0)),
	})),
	withComputed(({ currentTime }) => ({
		currentSeconds: computed(() => Math.floor(currentTime() / 1e3)),
		currentIntervals: computed(() => decomposeDuration(currentTime())),
	})),
	withComputed(({ currentTime, intervalDuration, currentIntervals }) => ({
		timeText: computed(() => formatTime(currentIntervals())),
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
			const prevRound = store.currentRound()
			patchState(store, state =>
			{
				if (store.isPaused()) return {}
				const { startTime } = state
				const current = store.currentTime()
				const intervalDuration = store.intervalDuration()

				if (intervalDuration && current >= intervalDuration)
				{
					const currentRound = store.currentRound() + 1

					return {
						startTime: performance.now(),
						elapsedTime: null,
						accumulatedTime: 0,
						currentRound,
					}
				} else
				{
					return {
						elapsedTime: startTime
							? performance.now() - (startTime ?? 0)
							: null,
					}
				}
			})

			this.playMarkers()

			const rounds = store.rounds()
			const currentRound = store.currentRound()

			if (prevRound !== currentRound)
			{
				this.fillMarkers()
				if (rounds && currentRound >= rounds) this.stop()
			}
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
		setTotalSeconds(totalSeconds: number)
		{
			this.update({
				intervalDuration: totalSeconds * 1e3,
			})
		},
		start(): void
		{
			patchState(store, {
				startTime: performance.now(),
			})
			this.fillMarkers()
			this.updateIntervalId(() => this.tick(), TICK_INTERVAL)
		},
		pause(): void
		{
			this.updateIntervalId()
			markerPlayer.stop()
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
			this.fillMarkers()
		},
		play(): void
		{
			if (store.intervalId())
			{
				this.pause()
			} else this.start()
		},
		reset(): void
		{
			patchState(store, {
				intervalDuration: null, rounds: null,
			})
			this.fillMarkers()
		},
		fillMarkers(): void
		{
			patchState(store, () =>
			{
				const intervalDuration = store.intervalDuration()
				return {
					audioMarkers: _.filter(
						[...BASE_AUDIO_MARKERS],
						({ offset }) => offset <= intervalDuration
					)
				}
			})
		},
		playMarkers(): void
		{
			patchState(store, ({ audioMarkers, audioVolume }) =>
			{
				const current = store.currentTime()
				const intervalDuration = store.intervalDuration()
				const cutoff = intervalDuration - current

				const [toPlay, markers] = _.partition(
					audioMarkers,
					({ offset }) => cutoff <= (offset as number)
				)
				for (const { offset, options } of toPlay) markerPlayer.playMarker({
					offset,
					options: {
						...options,
						volume: audioVolume
					}
				})

				return { audioMarkers: markers }
			})
		},
	}))
)
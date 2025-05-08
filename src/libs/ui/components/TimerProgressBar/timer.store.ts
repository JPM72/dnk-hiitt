import _ from 'lodash'
import { computed } from '@angular/core'
import { patchState, signalStore, withState, withComputed, withMethods } from '@ngrx/signals'
import { formatTime } from '@/libs/utils'
import { Howl } from 'howler'

interface AudioMarker
{
	offset: number
	name: string
}

const BASE_AUDIO_MARKERS = [
	{
		name: 'thirty.mp3',
		offset: 30e3,
	},
	{
		name: 'fifteen.mp3',
		offset: 15e3,
	},
	{
		name: 'beeping-5-countdown.mp3',
		offset: 5e3,
	},
]

type TimerState = {
	startTime: number | null
	accumulatedTime: number
	elapsedTime: number | null
	intervalId: number | null
	minutes: number | null
	seconds: number | null
	rounds: number | null
	currentRound: number
	audioMarkers: AudioMarker[]
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
	audioMarkers: [...BASE_AUDIO_MARKERS],
}


const TICK_INTERVAL = 16
const setInterval = function (...args: Parameters<typeof window.setInterval>)
{
	return window.setInterval(...args) as unknown as number
}
const playMarker = (marker: AudioMarker) =>
{
	const sound = new Howl({ src: [`/sounds/${marker.name}`] })
	sound.play()
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
	play(name: string)
	{
		this.stop()
		this.howl = new Howl({ src: [`/sounds/${name}`] })
		this.howl.play()
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



			// if (store.currentRound() !== prevRound) console.log(prevRound, store.currentRound())

			// if (rounds)
			// {
			// 	const currentRound = store.currentRound()
			// 	if (currentRound >= rounds) this.stop()
			// }

			// if (rounds && store.currentRound() >= rounds) this.stop()
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
				minutes: null, seconds: null, rounds: null,
			})
			this.fillMarkers()
		},
		fillMarkers(): void
		{
			patchState(store, () =>
			{
				const intervalDuration = store.intervalDuration()
				console.log(intervalDuration)
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
			patchState(store, ({ audioMarkers }) =>
			{
				const current = store.currentTime()
				const intervalDuration = store.intervalDuration()
				const cutoff = intervalDuration - current

				const [toPlay, markers] = _.partition(audioMarkers, ({ offset }) => cutoff <= offset)
				for (const { name } of toPlay) markerPlayer.play(name)
				return { audioMarkers: markers }
			})
		},
	}))
)
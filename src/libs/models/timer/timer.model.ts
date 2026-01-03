import type { AudioMarker } from '../audio-marker/audio-marker.model'

export interface TimerModel
{
	/**
	 * Unix timestamp in milliseconds of
	 * most recent timer start/unpause.
	 */
	startTime: number | null
	/**
	 * Time in milliseconds since last timer
	 * start or unpause.
	 */
	elapsedTime: number | null
	/**
	 * Time in milliseconds since most recent
	 * timer start that the timer has spent in
	 * an unpaused state.
	 */
	accumulatedTime: number | null
	intervalId: number | null
}

export type TimerState = {
	intervalDuration: number | null
	startTime: number | null
	accumulatedTime: number
	elapsedTime: number | null
	intervalId: number | null
	rounds: number | null
	currentRound: number
	audioMarkers: AudioMarker[]
	audioVolume: number
}
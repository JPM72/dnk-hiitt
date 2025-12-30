import type { AudioMarker } from '../audio-marker/audio-marker.model'

export interface TimerModel
{
	startTime: number | null
	accumulatedTime: number | null
	elapsedTime: number | null
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
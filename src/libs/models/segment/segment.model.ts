import type { AudioMarker } from '../audio-marker/audio-marker.model'

export interface Segment
{
	id: string
	/* duration in milliseconds */
	duration: number
	label: string | null
	repeat: number | null
	sounds: AudioMarker[]
}
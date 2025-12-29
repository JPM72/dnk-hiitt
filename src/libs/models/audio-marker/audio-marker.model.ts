import type { HowlOptions } from 'howler'

export type OffsetLabel = 'start' | 'end'

export interface AudioMarker
{
	/**
	 * Time offset in milliseconds from segment
	 * start/end. Positive indicates offset from
	 * start, negative from end.
	 */
	offset: OffsetLabel | number
	options: HowlOptions
}
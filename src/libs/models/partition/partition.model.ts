import type { TimerModel } from '../timer/timer.model'

export interface PartitionModel extends TimerModel
{
	/**
	 * Duration in milliseconds of active part
	 */
	activeDuration: number | null
	/**
	 * Duration in milliseconds of rest part
	 */
	restDuration: number | null
}
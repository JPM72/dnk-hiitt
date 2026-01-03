import _ from 'lodash'
import { computed } from '@angular/core'
import { signalStore, patchState, withState, withComputed, withMethods, withFeature } from '@ngrx/signals'
import type { PartitionModel } from './partition.model'
import { decomposeDuration, formatTime } from '@/libs/utils'
import { withTimer } from '../timer/with-timer'

const initialState = (): Pick<PartitionModel, 'activeDuration' | 'restDuration'> => ({
	activeDuration: null,
	restDuration: null,
})

export const PartitionStore = signalStore(
	withFeature(withTimer),
	withState(initialState),
	withComputed(({
		activeDuration,
		restDuration,
	}) => ({
		/** Sum of active + rest duration, in milliseconds */
		totalDuration: computed(() => (activeDuration() ?? 0) + (restDuration() ?? 0)),
	})),
	withComputed(({
		currentTime,
		activeDuration,
		restDuration,
		totalDuration,
	}) => ({
		currentPortion: computed(() => {
			const active = activeDuration()
			const rest = restDuration()
			if (!_.every([active, rest], _.isNumber)) return null
			const t = currentTime() % totalDuration()
			return t <= active ? 'active' : 'rest'
		}),
		progress: computed(() =>
		{
			const duration = totalDuration()
			if (!duration) return 0
			return Math.min(
				100,
				_.round(100 * (currentTime() / duration), 3)
			)
		}),
	})),
	withMethods(store => ({
		setActiveDuration(activeDuration: number | null)
		{
			patchState(store, { activeDuration })
		},
		setRestDuration(restDuration: number | null)
		{
			patchState(store, { restDuration })
		},
	}))
)
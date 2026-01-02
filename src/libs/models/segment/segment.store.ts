import type { Segment } from './segment.model'
import { computed } from '@angular/core'
import
{
	patchState,
	signalStore,
	type,
	withComputed,
	withMethods,
} from '@ngrx/signals'
import
{
	type EntityId,
	entityConfig,
	withEntities,
	addEntity,
	addEntities,
	prependEntity,
	prependEntities,
	updateEntity,
	updateEntities,
	updateAllEntities,
	setEntity,
	setEntities,
	setAllEntities,
	upsertEntity,
	upsertEntities,
	removeEntity,
	removeEntities,
	removeAllEntities,
} from '@ngrx/signals/entities'
import _ from 'lodash'

const selectId = ({ id }: Segment) => id

let _id = 0
const defaults = (segment: Partial<Segment> = {}): Segment => {
	const instance = _.defaults({}, segment, {
		duration: 60e3,
		label: null,
		repeat: null,
		sounds: []
	})
	instance.id ??= `segment-${++_id}`
	return instance as Segment
}

const segmentConfig = entityConfig({
	entity: type<Segment>(),
	collection: 'segment',
	selectId,
})

type EntityPredicate<Entity> = (entity: Entity) => boolean;

export const SegmentsStore = signalStore(
	withEntities(segmentConfig),
	withMethods((store) => ({
		createOne(payload: Partial<Segment>): Segment
		{
			const instance = defaults(payload)
			patchState(store, addEntity(instance, segmentConfig))
			return instance
		},
		addOne(payload: Segment): void
		{
			patchState(store, addEntity(payload, segmentConfig))
		},
		addMany(payload: Segment[]): void
		{
			patchState(store, addEntities(payload, segmentConfig))
		},
		prependOne(payload: Segment): void
		{
			patchState(store, prependEntity(payload, segmentConfig))
		},
		prependMany(payload: Segment[]): void
		{
			patchState(store, prependEntities(payload, segmentConfig))
		},
		updateOne(...args: Parameters<typeof updateEntity<Segment>>): void
		{
			patchState(store, updateEntity(...args, segmentConfig))
		},
		updateMany(...args: Parameters<typeof updateEntities<Segment>>): void
		{
			patchState(store, updateEntities(...args, segmentConfig))
		},
		updateAll(...args: Parameters<typeof updateAllEntities<Segment>>): void
		{
			patchState(store, updateAllEntities(...args, segmentConfig))
		},
		setOne(payload: Segment): void
		{
			patchState(store, setEntity(payload, segmentConfig))
		},
		setMany(payload: Segment[]): void
		{
			patchState(store, setEntities(payload, segmentConfig))
		},
		setAll(payload: Segment[]): void
		{
			patchState(store, setAllEntities(payload, segmentConfig))
		},
		upsertOne(payload: Segment): void
		{
			patchState(store, upsertEntity(payload, segmentConfig))
		},
		upsertMany(payload: Segment[]): void
		{
			patchState(store, upsertEntities(payload, segmentConfig))
		},
		removeOne(payload: Segment): void
		{
			patchState(store, removeEntity(selectId(payload), segmentConfig))
		},
		removeMany(payload: string[] | EntityPredicate<Segment>): void
		{
			patchState(store, removeEntities(payload as string[], segmentConfig))
		},
		removeAll(): void
		{
			patchState(store, removeAllEntities(segmentConfig))
		},
	}))
)
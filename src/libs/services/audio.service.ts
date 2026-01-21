import { Injectable } from '@angular/core'
import { Howl, Howler, HowlOptions } from 'howler'
import _ from 'lodash'

const getSoundSrc = (fileName: string | string[]): string[] => _(fileName).castArray().map(
	s => `/sounds/${s}`
).value()

const DEFAULT_HOWLER_OPTIONS: Partial<HowlOptions> = {
	html5: true,
	volume: 1,
}

@Injectable({
	providedIn: 'root',
})
export class AudioService
{
	private sounds = new Map<string, Howl>()

	private _volume: number = 1
	get volume() { return this._volume }
	set volume(v)
	{
		if (!_.isNumber(v))
		{
			console.warn(`Attempted to set volume to non-number "${v}"`)
			return
		}
		this._volume = _.clamp(v, 0, 1)
	}

	/**
	 * Load (or retrieve) a sound
	 */
	load(key: string, src: string | string[], options?: HowlOptions): Howl
	{
		const { sounds, volume } = this
		if (sounds.has(key)) return sounds.get(key)!

		const $src = getSoundSrc(src)

		const howl = new Howl({
			volume,
			...options,
			src: $src,
		})

		sounds.set(key, howl)
		return howl
	}

	/**
	 * Play a sound (auto-loads if needed)
	 */
	play(key: string, src?: string | string[], options?: HowlOptions): number
	{
		const sound = this.sounds.get(key)
			?? (src ? this.load(key, src, options) : undefined)

		if (!sound)
		{
			throw new Error(`Sound "${key}" not loaded and no src provided`)
		}

		if (_.isNumber(options?.volume))
		{
			sound.volume(options.volume)
		} else
		{
			sound.volume(this.volume)
		}

		const id = sound.play()

		return id
	}

	pause(key: string): void
	{
		this.sounds.get(key)?.pause()
	}

	stop(key: string): void
	{
		this.sounds.get(key)?.stop()
	}

	unload(key: string): void
	{
		this.sounds.get(key)?.unload()
		this.sounds.delete(key)
	}

	stopAll(): void
	{
		Howler.stop()
	}

	setMasterVolume(volume: number): void
	{
		Howler.volume(volume)
	}

	mute(muted = true): void
	{
		Howler.mute(muted)
	}
}

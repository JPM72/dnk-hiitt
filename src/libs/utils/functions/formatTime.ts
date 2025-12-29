import { decomposeDuration, DecomposedDuration } from './decomposeDuration'

export function formatTime(timeInMilliseconds: number | DecomposedDuration)
{
	const t = typeof timeInMilliseconds === 'object'
		? timeInMilliseconds as DecomposedDuration
		: decomposeDuration(timeInMilliseconds)
	const minutes = `${t.minutes}`.padStart(2, '0')
	const seconds = `${t.seconds}`.padStart(2, '0')
	const milliseconds = `${t.milliseconds}`.padStart(3, '0')
	return { minutes, seconds, milliseconds }
}
export default formatTime
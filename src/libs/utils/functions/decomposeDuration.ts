const { round } = Math

export function decomposeDuration(totalMilliseconds: number)
{
	const t = round(totalMilliseconds)
	const hours = t / 3600e3 | 0
	const minutes = (t / 60e3) | 0
	const seconds = (t / 1e3) % 60 | 0
	const milliseconds = t % 1e3
	return { hours, minutes, seconds, milliseconds }
}
export default decomposeDuration
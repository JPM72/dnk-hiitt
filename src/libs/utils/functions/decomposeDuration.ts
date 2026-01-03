const { floor, round } = Math

export interface DecomposedDuration
{
	hours: number
	minutes: number
	seconds: number
	milliseconds: number
}

export function decomposeDuration(totalMilliseconds: number): DecomposedDuration
{
	const t = round(totalMilliseconds)
	return {
		hours: floor(t / 3600e3),
		minutes: floor(t / 60e3),
		seconds: floor((t / 1e3) % 60),
		milliseconds: t % 1e3,
	}
}
export default decomposeDuration
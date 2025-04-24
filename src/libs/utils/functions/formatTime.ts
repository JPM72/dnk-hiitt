const { round } = Math

export function formatTime(time: number)
{
	const t = round(time)
	const minutes = `${(t / 60000) | 0}`.padStart(2, '0')
	const seconds = `${(t / 1000) % 60 | 0}`.padStart(2, '0')
	const milliseconds = `${t % 1000}`.padStart(3, '0')
	// return `${minutes}:${seconds}.${milliseconds}`
	return { minutes, seconds, milliseconds }
}
export default formatTime
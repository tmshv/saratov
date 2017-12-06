export function join(lists) {
	return lists.reduce((acc, x) => [...acc, ...x], []);
}
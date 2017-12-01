export default class ViewportQuality {
}

ViewportQuality.HIGH = 'high';
ViewportQuality.MEDIUM = 'medium';
ViewportQuality.LOW = 'low';
ViewportQuality.ADAPTIVE = 'adaptive';

const coefs = {
	[ViewportQuality.HIGH]: 1.0,
	[ViewportQuality.MEDIUM]: .5,
	[ViewportQuality.LOW]: .25,
};

ViewportQuality.getCoef = (quality) => coefs.hasOwnProperty(quality)
	? coefs[quality]
	: coefs[ViewportQuality.MEDIUM];

ViewportQuality.options = [
	{name: 'Высокое качество', value: ViewportQuality.HIGH},
	{name: 'Среднее качество', value: ViewportQuality.MEDIUM},
	{name: 'Низкое качество', value: ViewportQuality.LOW},
	{name: 'Адаптивное качество', value: ViewportQuality.ADAPTIVE},
];
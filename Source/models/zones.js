export const zones = [
	{
		name: 'Зона И1',
		color: '#ff1966',
		zoneName: 'zone_h1',
	},
	{
		name: 'Зона И2',
		color: '#f58e92',
		zoneName: 'zone_h2',
	},
	{
		name: 'Зона И3',
		color: '#fbd2d1',
		zoneName: 'zone_h3',
	},
	{
		name: 'Зона ИТ1',
		color: '#005baa',
		zoneName: 'zone_ht1',
	},
	{
		name: 'Зона ИТ2',
		color: '#73a5d8',
		zoneName: 'zone_ht2',
	},
	{
		name: 'Зона ИТ3',
		color: '#b5d2ee',
		zoneName: 'zone_ht3',
	},
	{
		name: 'ОКН',
		color: '#ffffff',
	},
];

export function getZoneColor(name, defaultValue) {
	const zone = zoneMap.get(name);
	return zone
		? zone.color
		: defaultValue;
}

const zoneMap = createZoneMap(zones);

function createZoneMap(list) {
	return list.reduce((map, x) => map.set(x.zoneName, x), new Map());
}
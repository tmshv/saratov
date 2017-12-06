export const ZONE_PUBLIC_SPACE = 'zone_public_space';

export const zones = [
	{
		name: 'Зона И1',
		color: '#ff1940',
		zoneName: 'zone_h1',
	},
	{
		name: 'Зона И2',
		color: '#FF7373',
		zoneName: 'zone_h2',
	},
	{
		name: 'Зона И3',
		color: '#ffa1a1',
		zoneName: 'zone_h3',
	},
	{
		name: 'Зона ИТ1',
		color: '#004978',
		zoneName: 'zone_ht1',
	},
	{
		name: 'Зона ИТ2',
		color: '#246DAC',
		zoneName: 'zone_ht2',
	},
	{
		name: 'Зона ИТ3',
		color: '#77ABEE',
		zoneName: 'zone_ht3',
	},
	{
		name: 'Зона ОП',
		color: '#7ec395',
		zoneName: ZONE_PUBLIC_SPACE,
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
	return list.reduce(
		(map, x) => x.zoneName
			? map.set(x.zoneName, x)
			: map,
		new Map()
	);
}
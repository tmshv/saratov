export const attributeTranslation = {
	"width": "Ширина (макс), м*",
	"depth": "Глубина (макс), м*",
	"angle_lot": "Для угловых участков",
	"max_area": "Площадь (макс), м2*",
	"lot_dencity": "Процент застроенности (макс)*",
	"mm_dencity": "Доля площади плоскостных парковок на участке (макс), %",
	"green_dencity": "Доля озелененных пространств на участке (мин), %",
	"redline": "Отступ линии застройки от красной линии, м",
	"depth_bld": "Глубина здания (макс), м",
	"redline_dencity": "Доля застроенного уличного фронта вдоль красной линии (мин), %",
	"height": "Высота застройки (макс), м",
	"street_height": "Высота фронта главного фасада (макс), м",
	"border_height": "Высота ограждения (макс), м",
	"cap_type": "Допустимый тип кровли здания, выходящего на уличный фронт, градусы",
	"cap": "Уклон кровли здания, выходящего на уличный фронт (макс), градусы",
	"glass_dencity": "Процент остекления главного фасада (мин), %разработке",
	"horizontal_step": "Расстояния между горизонтальными осями (макс), м*",
	"vertical_step": "Расстояния между вертикальными осями (макс), м*",
	"window": "Пропорции окон*",
	"console": "Размер выступа элементов их плоскости фасада, м",
	"colour": "Цветовая палитра",
	"start_floor_height": "Высота (мин), м*",
	"entrance_height": "Уровень входа (макс), м*",
	"glass_dencity_start_floor": "Процент остекления (мин),%",
	"glass_transparency_start_floor": "Процент прозрачности остекления (мин), %",
	"entrance": "Входы (для нежилых функций)*",
	"entrance_transparency": "Прозрачность входов (мин), %",
	"border_transparency": "Прозрачность ограждений (мин), %",
	"function": "Виды разрешенного использования",
	"start_floor_area": "Максимальная площадь учреждений, расположенных на 1 этаже, м2",
	"S_lot": "Площадь участка, м2",
	"S_b": "Общая площадь застройки, м2",
	"S_footprint": "Площадь подошвы здания, м2",
	"S_mm": "Площадь плоскостных парковок на участке, м2",
	"S_green": "Площадь озеленения",
	"status": "Статус территории",
};

export const groups = [
	{
		"name": "ОСНОВНЫЕ ТЭП",
		"attributes": [
			"S_lot",
			"S_b",
			"S_footprint",
			"S_mm",
			"S_green",
			"status",
		]
	},

	{
		"name": "РАЗМЕР УЧАСТКА / БАЛАНС ТЕРРИТОРИЙ",
		"attributes": [
			"width",
			"depth",
			"angle_lot",
			"max_area",
			"lot_dencity",
			"mm_dencity",
			"green_dencity",
		]
	},

	{
		"name": "ОТСТУПЫ,  РАЗРЫВЫ, РАСПОЛОЖЕНИЕ НА УЧАСТКЕ",
		"attributes": [
			"redline",
			"depth_bld",
			"redline_dencity",
		]
	},

	{
		"name": "ПРОСТРАНСТВЕННЫЙ КОНВЕРТ",
		"attributes": [
			"height",
			"street_height",
			"border_height",
			"cap_type",
			"cap",
		]
	},

	{
		"name": "АРХИТЕКТУРНО-ХУДОЖЕСТВЕННОЕ РЕШЕНИЕ ФАСАДОВ, ВЫХОДЯЩИХ НА УЛИЧНЫЙ ФРОНТ",
		"attributes": [
			"glass_dencity",
			"horizontal_step",
			"vertical_step",
			"window",
			"console",
			"colour",
		]
	},

	{
		"name": "ПАРАМЕТРЫ ФРОНТА ПЕРВОГО ЭТАЖА",
		"attributes": [
			"start_floor_height",
			"entrance_height",
			"glass_dencity_start_floor",
			"glass_transparency_start_floor",
			"entrance",
			"entrance_transparency",
			"border_transparency",
		]
	},

	{
		"name": "ПАРАМЕТРЫ ФУНКЦИЙ ПЕРВОГО ЭТАЖА",
		"attributes": [
			"function",
			"start_floor_area",
		]
	}
];
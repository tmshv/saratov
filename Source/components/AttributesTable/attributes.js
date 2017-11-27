export const attributeTranslation = {
	name: "имя",
	zone: "Зона",
	width: "Ширина (макс), м",
	depth: "Глубина (макс), м",
	"angle lot": "Глубина углового участка (макс), м",
	max_area: "Площадь (макс), м2",
	min_area: "Площадь (мин), м2",
	lot_dencity: "Доля застроенности (макс), %",
	mm_dencity: "Доля территории участка, занимаемая плоскостной автостоянкой (макс), %",
	green_dencity: "Доля озеленения на участке (мин), %",
	redline: "Отступ линии застройки от красной линии (макс), м",
	redline_dencity: "Доля застроенности участка по уличному фронту (мин), %",
	redline_facade: "Длина фасада по уличному фронту (макс), м",
	min_dist_car: "Отступ плоскостных автостоянок от красной линии (мин), м",
	utilities_max_dist: "Отступ зданий и сооружений  вспомогательных видов разрешенного использования от красной линии (макс), м",
	height: "Высота застройки (макс), м",
	street_height: "Высота до карниза / парапета вдоль фронта улицы (макс), м",
	cap_type: "Допустимый тип кровли здания, выходящего на уличный фронт",
	cap: "Уклон кровли здания, выходящего на уличный фронт (макс), градусы",
	cap_k: "Отступ плоскости верхних этажей от линии застройки, м / уклон угловой плоскости пространственного конверта, градусы",
	glass_dencity: "Доля площади проемов к глухой поверхности стены (мин), %",
	window_prportion: "Пропорции окон (высота к ширине)*",
	wall_width: "Ширина простенка (макс), м",
	window_height: "Высота окна (макс), м",
	window_step: "Расстояния между горизонт. осями (макс), м*",
	window_pattern: "Расстояния между вертикальными осями (макс), м*",
	consol: "Выступ консольных элементов здания из плоскости фасада (макс), м",
	consol_height: "Высота просвета между консольно выступающими элементами здания и поверхностью земли (мин), м",
	consol_area: "Доля плоскости выступающих элементов фасада (макс), %",
	facade_area: "Доля глухой поверхности фасада, окрашенной в основной цвет (мин), %",
	colour: "Палитра основных цветов фасада",
	material: "Материалы",
	start_floor_height: "Высота (мин), м*",
	entrance_height: "Уровень входа (макс), м*",
	hole_proportion: "Пропорции проемов (высота к ширине)*",
	border_height: "Высота ограждений (макс), м",
	border_transparancy: "Прозрачность ограждений (мин), %",
	entrance_public: "Входы (для нежилых помещений)*",
	entrance_live: "Входы (для жилых помещений)*",
	colour_start_floor: "Палитра основных цветов фасада (цвет первого этажа не должен отличаться от цвета фасада, выходящего на уличный фронт)",
	material_start_floor: "Материалы",
	column_step: "Шаг колонн (макс), м",
	S_lot: "Площадь участка, м2",
	S_b: "Общая площадь застройки, м2",
	S_footprint: "Площадь подошвы здания, м2",
	S_mm: "Площадь плоскостных парковок на участке, м2",
	S_green: "Площадь озеленения, м2",
	status: "Статус территории",
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
		"name": "ТРЕБОВАНИЯ К УЧАСТКАМ",
		"attributes": [
			"width",
			"depth",
			"angle lot",
			"max_area",
		]
	},

	{
		"name": "ТРЕБОВАНИЯ К РАСПОЛОЖЕНИЮ ОБЪЕКТОВ НА УЧАСТКЕ",
		"attributes": [
			"min_area",
			"lot_dencity",
			"mm_dencity",
			"green_dencity",
			"redline",
			"redline_dencity",
			"redline_facade",
			"min_dist_car",
		]
	},

	{
		"name": "ТРЕБОВАНИЯ К ОБЪЕМНО-ПРОСТРАНСТВЕННЫМ ХАРАКТЕРИСТИКАМ ЗАСТРОЙКИ",
		"attributes": [
			"utilities_max_dist",
			"height",
			"street_height",
			"cap_type",
			"cap",
		]
	},

	{
		"name": "ТРЕБОВАНИЯ К ФАСАДАМ ЗДАНИЙ, ВЫХОДЯЩИМ НА УЛИЧНЫЙ ФРОНТ (КРОМЕ ПЕРВОГО ЭТАЖА)",
		"attributes": [
			"cap_k",
			"glass_dencity",
			"window_prportion",
			"wall_width",
			"window_height",
			"window_step",
			"window_pattern",
			"consol",
			"consol_height",
			"consol_area",
			"facade_area",
			"colour",
			"material",
		]
	},

	{
		"name": "ТРЕБОВАНИЯ К ПЕРВЫМ ЭТАЖАМ ЗДАНИЙ, ВЫХОДЯЩИМ НА УЛИЧНЫЙ ФРОНТ",
		"attributes": [
			"start_floor_height",
			"entrance_height",
			"hole_proportion",
			"border_height",
			"border_transparancy",
			"glass_dencity",
			"entrance_public",
			"entrance_live",
			"colour_start_floor",
			"material_start_floor",
			"column_step",
		]
	}
];
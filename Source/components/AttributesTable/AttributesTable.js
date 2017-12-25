import React, {Component} from 'react';
import classNames from 'classnames';
import {groups, attributeTranslation, attributeUnits} from './attributes';
import Attribute from './Attribute';
import {isEmptyObject} from "../../lib/utils";
import {Float} from "../index";

function t(key) {
	return key in attributeTranslation
		? attributeTranslation[key]
		: key;
}

const exists = value => value !== null && value !== undefined && value !== '-';

function selectAttributes(names, attributes) {
	return names.reduce((acc, x) => {
		if (exists(attributes[x])) {
			acc[x] = attributes[x];
		}
		return acc;
	}, {});
}

export default class AttributesTable extends Component {
	constructor(props) {
		super(props);

		this.unfoldGroup = this.unfoldGroup.bind(this);
	}

	update(folded) {
		const {onChange} = this.props;
		onChange(folded);
	}

	unfoldGroup(index) {
		const {folded} = this.props;
		const newFolded = (folded || [])
			.map((x, i) => i !== index); // Only indexed group is unfolded
		newFolded[index] = false;

		this.update(newFolded);
	}

	isFolded(index) {
		const {folded} = this.props;

		const value = folded[index];
		return value !== undefined
			? value
			: true;
	}

	render() {
		const {attributes} = this.props;
		const displayGroups = groups
			.map((x, i) => ({
				name: x.name,
				footnote: x.footnote,
				attributes: selectAttributes(x.attributes, attributes)
			}))
			.filter(x => !isEmptyObject(x.attributes));

		const changedGroupsSize = groups.length !== displayGroups.length;

		const items = displayGroups
			.map((x, i) => (
				<AttributesGroup
					footnote={x.footnote}
					folded={changedGroupsSize
						? i !== 0
						: this.isFolded(i)
					}
					onClick={() => {
						this.unfoldGroup(i);
					}}
					key={i}
					attributes={x.attributes}
				>
					{x.name}
				</AttributesGroup>
			));

		return (
			<div className={classNames('AttributesTable', 'Block')}>
				<ul>
					{items}
				</ul>
			</div>
		)
	}
}

class AttributesGroup extends Component {
	render() {
		const {children, folded, attributes, footnote} = this.props;
		const {onClick} = this.props;

		return (
			<li className={classNames('AttributesTableItem', {
				'AttributesTableItem--folded': folded,
				'AttributesTableItem--unfolded': !folded,
			})}
				onClick={onClick}
			>
				<span className='AttributesTableItem-Name'
				>{children}</span>
				{folded ? null : (
					<div>
						<AT attributes={attributes}/>
						<Footnote>{footnote}</Footnote>
					</div>
				)}
			</li>
		);
	}
}

const Footnote = ({children}) => !children ? null : (
	<span className="AttributesTableItem-Footnote">{children}</span>
);

const AT = ({attributes}) => {
	return (
		<ul className='AttributesBlock'>
			{
				Object
					.entries(attributes)
					.map(([name, value]) => [name, t(name), value])
					.map(([name, text, value], i) => (
						<AttributeRow key={i} name={name} text={text} value={value} vertical={isVertical(name)}/>
					))
			}
		</ul>
	);
};

const AttributeRow = ({name, text, value, vertical = false}) => {
	return (
		<li className={classNames('AttributeRow', {
			'vertical': vertical,
		})}>
			<span className='AttributeRow-Name'>{text}</span>
			{createValue(name, value)}
		</li>
	);
};

function isVertical(name) {
	if (name === 'colour') return true;
	if (name === 'colour_start_floor') return true;
	if (name === 'cap_k') return true;

	return false;
}

function getUnit(name) {
	return attributeUnits[name];
}

function createValue(name, value) {
	if (name === 'colour') return <AttributeColorValue>{parseColor(value)}</AttributeColorValue>;
	if (name === 'colour_start_floor') return <AttributeColorValue>{parseColor(value)}</AttributeColorValue>;

	value = parseValue(name, value);
	return <AttributeValue units={getUnit(name)}>{value}</AttributeValue>;
}

function parseValue(name, value) {
	const round = (value, n = 1) => Math.round(value * n) / n;

	const attributesMultiplyCoefs = {
		lot_dencity: 100,
		mm_dencity: 100,
		green_dencity: 100,
		redline_dencity: 100,
	};

	const roundAttributes = {
		S_lot: true,
		S_b: true,
		S_footprint: true,
		S_mm: true,
		S_green: true,
	};

	if (attributesMultiplyCoefs.hasOwnProperty(name)) {
		const x = attributesMultiplyCoefs[name];
		return parseFloat(value) * x;
	}

	if (roundAttributes.hasOwnProperty(name)) {
		return round(parseFloat(value));
	}

	return value;
}

function parseColor(value) {
	return value
		.replace(/\//g, ';')
		.split(';')
		.map(x => `#${x}`);
}

const AttributeValue = ({children, units}) => {
	return (
		<span className='AttributeRow-Value'>
			<Attribute units={units}>{children}</Attribute>
		</span>
	);
};

const AttributeColorValue = ({children: colors}) => {
	return (
		<ul className={classNames('AttributeRow-Value', 'AttributeColor')}>
			{
				colors.map((x, i) => (
					<Color key={i}>{x}</Color>
				))
			}
		</ul>
	);
};

const Color = ({children: color}) => (
	<li>
		<div style={{
			width: '30px',
			height: '30px',
			backgroundColor: color,
		}}/>
	</li>
);
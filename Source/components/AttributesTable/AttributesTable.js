import React, {Component} from 'react';
import classNames from 'classnames';
import {groups, attributeTranslation} from './attributes';
import {isEmptyObject} from "../../lib/utils";

function t(key) {
	return key in attributeTranslation
		? attributeTranslation[key]
		: key;
}

const exists = value => value !== null && value !== undefined;

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

	componentDidMount(){
		this.update(this.props.folded);
	}

	update(folded) {
		const {onChange} = this.props;
		const r = this.element.getBoundingClientRect();
		onChange(folded, r);
	}

	unfoldGroup(index) {
		const {folded} = this.props;
		const newFolded = (folded || [])
			.map((x, i) => i !== index); // Only indexed group is unfolded
		newFolded[index] = false;

		this.update(newFolded);

		setTimeout(() => {
			this.update(newFolded);
		}, 0);
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
				attributes: selectAttributes(x.attributes, attributes)
			}))
			.filter(x => !isEmptyObject(x.attributes));

		const changedGroupsSize = false;//groups.length !== displayGroups.length;

		const items = displayGroups
			.map((x, i) => (
				<AttributesGroup
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
			<div className='AttributesTable' ref={x => {
				this.element = x;
			}}>
				<ul style={{
					padding: '10px',
				}}>
					{items}
				</ul>
			</div>
		)
	}
}

class AttributesGroup extends Component {
	render() {
		const {children, folded, attributes} = this.props;
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
					<AT attributes={attributes}/>
				)}
			</li>
		);
	}
}

const AT = ({attributes}) => {
	return (
		<ul className='AttributesBlock'>
			{
				Object
					.entries(attributes)
					.map(([name, value]) => [name, t(name), value])
					.map(([name, text, value], i) => (
						<AttributeRow key={i} name={name} text={text} value={value}/>
					))
			}
		</ul>
	);
};

const AttributeRow = ({name, text, value}) => {
	return (
		<li className='AttributeRow'>
			<span className='AttributeRow-Name'>{text}</span>
			{createValue(name, value)}
		</li>
	);
};

function createValue(name, value) {
	if (name === 'colour') return <AttributeColorValue>{parseColor(value)}</AttributeColorValue>;
	if (name === 'colour_start_floor') return <AttributeColorValue>{parseColor(value)}</AttributeColorValue>;
	return <AttributeValue>{value}</AttributeValue>;
}

function parseColor(value) {
	const colors = value
		.replace(/\//g, ';')
		.split(';')
		.map(x => `#${x}`);
	return colors;
}

const round = (value, n = 1) => Math.round(value * n) / n;
const isNumber = value => typeof value === 'number';

const AttributeValue = ({children, n = 1}) => {
	return (
		<span className='AttributeRow-Value'>
			{
				isNumber(children)
					? round(children, n)
					: children
			}
		</span>
	);
};

const AttributeColorValue = ({children: colors}) => {
	return (
		<ul className='AttributeRow-Value'>
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
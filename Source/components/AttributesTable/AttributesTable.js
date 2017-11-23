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

		this.state = {
			folded: groups.map((x, i) => i !== 0), // Only first group is unfolded by default
		};
	}

	unfoldGroup(index) {
		const {folded} = this.state;
		this.setState({
			folded: folded.map((x, i) => i !== index), // Only indexed group is unfolded
		})
	}

	isFolded(index) {
		const {folded} = this.state;
		return folded[index];
	}

	render() {
		const {attributes} = this.props;
		const displayGroups = groups
			.map((x, i) => ({
				name: x.name,
				attributes: selectAttributes(x.attributes, attributes)
			}))
			.filter(x => !isEmptyObject(x.attributes));

		const changedGroupsSize = groups.length !== displayGroups.length;

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
			<div className='AttributesTable'>
				<ul>
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
					.map(([name, value]) => [t(name), value])
					.map(([name, value], i) => (
						<AttributeRow key={i} name={name}>
							{value}
						</AttributeRow>
					))
			}
		</ul>
	);
};

const AttributeRow = ({name, children: value}) => {
	return (
		<li className='AttributeRow'>
			<span className='AttributeRow-Name'>{name}</span>
			<AttributeValue>{value}</AttributeValue>
		</li>
	);
};

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

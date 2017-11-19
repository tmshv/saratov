import React, {Component} from 'react';
import classNames from 'classnames';
import {groups, attributeTranslation} from './attributes';

function t(key) {
	return key in attributeTranslation
		? attributeTranslation[key]
		: key;
}

function selectAttributes(names, attributes) {
	return names.reduce((acc, x) => ({
		...acc,
		[x]: attributes[x],
	}), {});
}

export default class AttributesTable extends Component {
	render() {
		const {attributes} = this.props;
		return (
			<div className='AttributesTable'>
				<ul>
					{
						groups.map((x, i) => (
							<AttributesGroup
								key={i}
								attributes={selectAttributes(x.attributes, attributes)}
							>
								{x.name}
							</AttributesGroup>
						))
					}
				</ul>
			</div>
		)
	}
}

class AttributesGroup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			folded: true,
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		const {folded} = this.state;
		this.setState({
			folded: !folded,
		})
	}

	render() {
		const {children, attributes} = this.props;
		const {folded} = this.state;

		return (
			<li className={classNames('AttributesTableItem', {
				'AttributesTableItem--folded': folded,
				'AttributesTableItem--unfolded': !folded,
			})}
				onClick={this.onClick}
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

import React, {Component} from 'react';
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
			<li onClick={this.onClick}>
				<span>{children}</span>
				{folded ? null : (
					<AT attributes={attributes}/>
				)}
			</li>
		);
	}
}

const AT = ({attributes}) => {
	return (
		<ul>
			{
				Object
					.entries(attributes)
					.map(([key, value]) => [t(key), value])
					.map(([key, value], i) => (
						<li key={i}>
							<span>{key}</span>
							<span>{value}</span>
						</li>
					))
			}
		</ul>
	);
};

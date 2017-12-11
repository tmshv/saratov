import React, {Component} from 'react';
import classNames from 'classnames';
import {zones} from '../../models/zones';

const defaultStyle = {
	theme: 'fill',
};

const legend = zones.map(x => ({
	name: x.name,
	color: x.color,
	...legendStyle(x),
}));

function legendStyle({legend = defaultStyle}) {
	return legend;
}

export default class Legend extends Component {
	render() {
		const items = legend.map(({name, ...item}, i) => (
			<LegendItem
				key={i}
				{...item}
			>
				{name}
			</LegendItem>
		));

		return (
			<div className={classNames('Legend', 'Block')}>
				<ul>
					{items}
				</ul>
			</div>
		)
	}
}

const LegendItem = ({children, ...props}) => (
	<li className='LegendItem'>
		<ColorElement {...props}/>
		<span className='LegendItem-Name'>{children}</span>
	</li>
);

const ColorElement = ({theme, ...props}) => {
	console.log(theme, props)
	const Component = theme === 'fill'
		? ColorBlock
		: ColorFrame;
	return <Component {...props}/>
};

const ColorFrame = ({color = 'red', size = 20, strokeWidth}) => {
	const px = v => `${v}px`;
	const s = px(size - strokeWidth * 2);

	return (
		<div className='ColorBlock' style={{
			width: s,
			height: s,
			border: `${px(strokeWidth)} solid ${color}`,
		}}/>
	)
};

const ColorBlock = ({color = 'red', width = '20px', height = '20px'}) => (
	<div className='ColorBlock' style={{width, height, backgroundColor: color}}/>
);
import React, {Component} from 'react';
import {legend} from './legendDefinition';

export default class Legend extends Component {
	render() {
		const items = legend.map((x, i) => (
			<LegendItem key={i} color={x.color}>
				{x.name}
			</LegendItem>
		));

		return (
			<div className='Legend'>
				<ul>
					{items}
				</ul>
			</div>
		)
	}
}

const LegendItem = ({color, children}) => (
	<li className='LegendItem'>
		<ColorBlock color={color}/>
		<span className='LegendItem-Name'>{children}</span>
	</li>
);

const ColorBlock = ({color = 'red', width = '20px', height = '20px'}) => (
	<div className='ColorBlock' style={{width, height, backgroundColor: color}}/>
);
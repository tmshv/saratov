import React, {Component} from 'react';
import connect from '../../decorators/connect';
import {selectedLayersSignal} from '../../signals';

@connect(
	selectedLayersSignal,
	data => {
		return {
			layers: data || [],
			onToggle: index => {
				selectedLayersSignal.trigger((data || []).map((x, i) => ({
					...x,
					checked: i === index
						? !x.checked
						: x.checked,
				})));
			},
		};
	}
)
export default class Legend extends Component {
	render() {
		const {layers, onToggle} = this.props;

		const items = layers.map(({name, checked}, i) => (
			<LayersItem
				key={i}
				checked={checked}
				onChange={() => {
					onToggle(i)
				}}
			>
				{name}
			</LayersItem>
		));

		return (
			<div className='Layers'>
				<ul>
					{items}
				</ul>
			</div>
		)
	}
}

const LayersItem = ({checked, onChange, children}) => (
	<li className='LayersItem'>
		<label>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
			/>
			{children}
		</label>
	</li>
);

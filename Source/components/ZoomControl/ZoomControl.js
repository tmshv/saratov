import React, {Component} from 'react';
import connect from '../../decorators/connect';
import {zoomSignal} from '../../signals';

const step = 500;

@connect(
	zoomSignal,
	data => {
		return {
			onPlus: () => {
				zoomSignal.trigger(step);
			},
			onMinus: () => {
				zoomSignal.trigger(-step);
			},
		};
	}
)
export default class Legend extends Component {
	render() {
		const {onPlus, onMinus} = this.props;

		return (
			<div>
				<button onClick={onPlus}>+</button>
				<button onClick={onMinus}>-</button>
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

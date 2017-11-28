import React, {Component} from 'react';
import classNames from 'classnames';
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
export default class ZoomControl extends Component {
	render() {
		const {onPlus, onMinus} = this.props;

		return (
			<div className={classNames('Block', 'ZoomControl')}>
				<button className={classNames('ZoomControlButton')} onClick={onPlus}>+</button>
				<button className={classNames('ZoomControlButton')} onClick={onMinus}>–</button>
			</div>
		)
	}
}

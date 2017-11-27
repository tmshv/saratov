import React, {Component} from 'react';
import classNames from 'classnames';
import Map from '../Map';
import {initMap, getDefaultViewerOptions} from '../../map';
import Legend from '../Legend';
import Layers from '../Layers';
import ZoomControl from '../ZoomControl';
import ATBlock from '../ATBlock';
import connect from '../../decorators/connect';
import {selectedFeatureSignal, highlightFeatureSignal, canvasSignal} from '../../signals';

@connect(
	highlightFeatureSignal,
	data => ({
		canInteract: Boolean(data),
	})
)
@connect(
	selectedFeatureSignal,
	data => ({
		attributes: data,
	})
)
@connect(
	null,
	() => ({
		onCanvasRender: canvas => {
			canvasSignal.trigger(canvas);
		},
	})
)
export default class App extends Component {
	render() {
		const {attributes, canInteract, onCanvasRender} = this.props;

		const attributesBlock = !attributes ? null : (
			<ATBlock attributes={attributes}/>
		);

		return (
			<div className='App'>
				<Map
					options={getDefaultViewerOptions()}
					init={initMap}
					canInteract={canInteract}
					onCanvasRender={onCanvasRender}
				/>

				<Block className='FlowBlock-Logo'>
					<div>
						<h1>
							ОБЪЕМНО-ПРОСТРАНСТВЕННЫЙ РЕГЛАМЕНТ НА ТЕСТОВУЮ ТЕРРИТОРИЮ Г. САРАТОВА
						</h1>

						<ZoomControl/>
					</div>
				</Block>

				<Block className='FlowBlock-Legend'>
					<Legend/>
				</Block>

				<Block className='FlowBlock-Layers'>
					<Layers/>
				</Block>

				{attributesBlock}
			</div>
		)
	}
};

const Block = ({className, children}) => (
	<div className={classNames('Flow-Block', 'Block-Background', className)}>
		{children}
	</div>
);
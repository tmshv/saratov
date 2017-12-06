import React, {Component} from 'react';
import classNames from 'classnames';
import Map from '../Map';
import {initMap, getDefaultViewerOptions} from '../../map';
import {canSelectFeature} from '../../map/interaction';
import Legend from '../Legend';
import ZoomControl from '../ZoomControl';
import ATBlock from '../ATBlock';
import connect from '../../decorators/connect';
import {selectedFeatureSignal, highlightFeatureSignal, canvasSignal, settingsSignal} from '../../signals';
import {Float, BlurBlock, BlackOpacityBlock} from '../index';
import Settings from '../Settings';

@connect(
	highlightFeatureSignal,
	data => ({
		canInteract: canSelectFeature(data),
	})
)
@connect(
	selectedFeatureSignal,
	attributes => ({
		attributes,
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
@connect(
	settingsSignal,
	(settings = {}) => {
		return {
			useBlur: Boolean(settings.blurredBackground),
		};
	},
)
export default class App extends Component {
	render() {
		const {attributes, useBlur, canInteract} = this.props;
		// const {attributes, canInteract} = this.props;
		const borderRadius = '2px';

		// const useBlur = true;
		const Block = useBlur
			? BlurBlock
			: BlackOpacityBlock;

		const onCanvasRender = useBlur
			? this.props.onCanvasRender
			: null;

		return (
			<div className='App'>
				<Map
					options={getDefaultViewerOptions()}
					init={initMap}
					canInteract={canInteract}
					onCanvasRender={onCanvasRender}
				/>

				<Float top={0} left={0}>
					<Block>
						<div className={classNames('Logo', 'Block')}>
							<h1>
								ОБЪЕМНО-ПРОСТРАНСТВЕННЫЙ РЕГЛАМЕНТ НА ТЕСТОВУЮ ТЕРРИТОРИЮ Г. САРАТОВА
							</h1>
						</div>
					</Block>
				</Float>

				<Float top={50} left={10}>
					<Block style={{
						borderRadius,
					}}>
						<ZoomControl/>
					</Block>
				</Float>

				<Float bottom={0} left={0}>
					<Block>
						<Legend/>
					</Block>
				</Float>

				<Float bottom={50} left={10}>
					<Block style={{
						borderRadius,
					}}>
						<Settings/>
					</Block>
				</Float>

				{!attributes ? null : (
					<Float top={10} right={10}>
						<Block>
							<ATBlock attributes={attributes}/>
						</Block>
					</Float>
				)}
			</div>
		)
	}
};

import React, {Component} from 'react';
import classNames from 'classnames';
import Map from '../Map';
import {initMap, getDefaultViewerOptions} from '../../map';
import Legend from '../Legend';
import ZoomControl from '../ZoomControl';
import ATBlock from '../ATBlock';
import connect from '../../decorators/connect';
import {selectedFeatureSignal, highlightFeatureSignal, canvasSignal} from '../../signals';
import {Float, BlurBlock} from '../';
import Settings from '../Settings';

@connect(
	highlightFeatureSignal,
	data => ({
		canInteract: Boolean(data),
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
export default class App extends Component {
	render() {
		const {attributes, canInteract, onCanvasRender} = this.props;
		const borderRadius = '2px';

		return (
			<div className='App'>
				<Map
					options={getDefaultViewerOptions()}
					init={initMap}
					canInteract={canInteract}
					onCanvasRender={onCanvasRender}
				/>

				<Float top={0} left={0}>
					<BlurBlock>
						<div className={classNames('Logo', 'Block')}>
							<h1>
								ОБЪЕМНО-ПРОСТРАНСТВЕННЫЙ РЕГЛАМЕНТ НА ТЕСТОВУЮ ТЕРРИТОРИЮ Г. САРАТОВА
							</h1>
						</div>
					</BlurBlock>
				</Float>

				<Float top={50} left={10}>
					<BlurBlock style={{
						borderRadius,
					}}>
						<ZoomControl/>
					</BlurBlock>
				</Float>

				<Float bottom={0} left={0}>
					<BlurBlock>
						<Legend/>
					</BlurBlock>
				</Float>

				<Float bottom={50} left={10}>
					<BlurBlock style={{
						borderRadius,
					}}>
						<Settings/>
					</BlurBlock>
				</Float>

				{!attributes ? null : (
					<Float top={10} right={10}>
						<BlurBlock>
							<ATBlock attributes={attributes}/>
						</BlurBlock>
					</Float>
				)}
			</div>
		)
	}
};

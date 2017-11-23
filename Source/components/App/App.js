import React, {Component} from 'react';
import classNames from 'classnames';
import Map from '../Map';
import {initMap, getDefaultViewerOptions} from '../../map';
import AttributesTable from '../AttributesTable';
import Legend from '../Legend';
import Layers from '../Layers';
import connect from '../../decorators/connect';
import {selectedFeatureSignal} from '../../signals';

@connect(
	selectedFeatureSignal,
	data => ({
		attributes: data,
	})
)
export default class App extends Component {
	render() {
		const {attributes} = this.props;

		const attributesBlock = attributes
			? (
				<Block className='FlowBlock-Attributes'>
					<AttributesTable attributes={attributes}/>
				</Block>
			)
			: null;

		return (
			<div className='App'>
				<Map
					options={getDefaultViewerOptions()}
					init={initMap}
				/>

				<Block className='FlowBlock-Logo'>
					<div>
						<h1>
							ОБЪЕМНО-ПРОСТРАНСТВЕННЫЙ РЕГЛАМЕНТ НА ТЕСТОВУЮ ТЕРРИТОРИЮ Г. САРАТОВА
						</h1>
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
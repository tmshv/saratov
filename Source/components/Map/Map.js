import React, {Component} from 'react';
import Cesium from 'cesium/Cesium';

export default class Map extends Component {
	componentDidMount() {
		const {options, init} = this.props;
		this.cesium = new Cesium.Viewer(this.element, {
			...options,
			creditContainer: this.creditContainer,
		});
		init(this.cesium);
	}

	render() {
		return (
			<div className='Map'
				 ref={x => {
					 this.element = x;
				 }}
			>
				<div ref={x => {
					this.creditContainer = x;
				}}/>
			</div>
		);
	}
};

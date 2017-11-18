import React, {Component} from 'react';

export default class Map extends Component {
	componentDidMount() {
		const {options, init} = this.props;
		this.cesium = new Cesium.Viewer(this.element, options);

		init(this.cesium);
	}

	render() {
		return (
			<div className='Map'
				 ref={x => {
					 this.element = x;
				 }}
			/>
		);
	}
};
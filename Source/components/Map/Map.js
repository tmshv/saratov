import React, {Component} from 'react';
import className from 'classnames';
import Cesium from 'cesium/Cesium';

export default class Map extends Component {
	componentDidMount() {
		const {options, init, onCanvasRender} = this.props;
		this.cesium = new Cesium.Viewer(this.element, {
			...options,
			creditContainer: this.creditContainer,
		});

		const canvas = this.cesium.scene.canvas;
		this.cesium.scene.postRender.addEventListener(() => {
			onCanvasRender(canvas);
		});

		init(this.cesium);
	}

	render() {
		const {canInteract} = this.props;

		const cn = className('Map', {
			'Map--interactive': canInteract,
		});

		return (
			<div className={cn}
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

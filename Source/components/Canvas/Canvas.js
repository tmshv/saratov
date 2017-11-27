import React, {Component} from 'react';
import connect from '../../decorators/connect';
import {canvasSignal} from '../../signals';

@connect(
	canvasSignal,
	source => ({
		source,
	})
)
export default class Canvas extends Component {
	componentDidMount() {
		this.ctx = this.canvas.getContext('2d');
	}

	componentWillReceiveProps() {
		const {source, blur} = this.props;
		if (source) this.updateCanvas(source, blur);
	}

	updateCanvas(source, blur) {
		const {width, height, sizeElement} = this.props;
		const se = sizeElement
			? sizeElement
			: this.canvas;
		// const {x, y, width: w, height: h} = this.canvas.getBoundingClientRect();
		const {x, y, width: w, height: h} = se.getBoundingClientRect();

		this.ctx.drawImage(source, x, y, w, h, 0, 0, width, height);
		this.ctx.filter = `blur(${blur}px)`;
	}

	render() {
		const {width, height} = this.props;

		return (
			<canvas
				ref={canvas => {
					this.canvas = canvas;
				}}
				width={width}
				height={height}
			/>
		);
	}
}


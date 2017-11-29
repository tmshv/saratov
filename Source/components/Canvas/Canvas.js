import React, {Component} from 'react';
import connect from '../../decorators/connect';
import {canvasSignal, settingsSignal} from '../../signals';

@connect(
	settingsSignal,
	(settings = {}) => ({
		coef: (settings.devicePixelRatio || 1) * (settings.quality || 1),
	})
)
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
		const {coef, width, height, sizeElement} = this.props;
		const se = sizeElement
			? sizeElement
			: this.canvas;
		let {x, y, width: w, height: h} = se.getBoundingClientRect();
		x *= coef;
		y *= coef;
		w *= coef;
		h *= coef;

		this.ctx.drawImage(source, x, y, w, h, 0, 0, width, height);
		this.ctx.filter = `blur(${blur}px)`;
	}

	render() {
		const {width, height, style = {}} = this.props;

		return (
			<canvas
				ref={canvas => {
					this.canvas = canvas;
				}}
				width={width}
				height={height}
				style={style}
			/>
		);
	}
}


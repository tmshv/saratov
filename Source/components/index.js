import React, {Component} from 'react';
import Canvas from './Canvas';

const exists = value => value !== undefined && value !== null;
const px = value => `${value}px`;

export class Float extends Component {
	getStyle() {
		const {top, left, bottom, right} = this.props;
		const style = {
			position: 'absolute',
		};

		if (exists(top)) style.top = px(top);
		else if (exists(bottom)) style.bottom = px(bottom);

		if (exists(left)) style.left = px(left);
		else if (exists(right)) style.right = px(right);

		return style;
	}

	render() {
		const {children} = this.props;
		const style = this.getStyle();
		return (
			<div style={style}>
				{children}
			</div>
		)
	}
}

export const Background = ({children}) => (
	<div style={{
		position: 'absolute',
		top: `${0}px`,
		left: `${0}px`,
	}}>
		{children}
	</div>
);

export class BlurBlock extends Component {
	constructor(props) {
		super(props);
		this.updateSize = this.updateSize.bind(this);

		this.state = {
			width: 0,
			height: 0,
			folded: [false],
		};

		this.requestId = null;
	}

	start() {
		this.requestId = requestAnimationFrame(this.updateSize);
	}

	stop() {
		if (this.requestId) {
			cancelAnimationFrame(this.requestId);
			this.requestId = null;
		}
	}

	updateSize() {
		const {width, height} = this.state;
		const rect = this.element.getBoundingClientRect();

		if (!(width === rect.width && rect.height === height)) {
			this.setState({
				width: rect.width,
				height: rect.height,
			})
		}

		this.start();
	}

	componentDidMount() {
		this.start();
	}

	componentWillUnmount() {
		this.stop();
	}

	render() {
		const {children, style} = this.props;
		const {width, height} = this.state;

		const canvas = !(width && height) ? null : (
			<Background>
				<Canvas blur={15} width={width} height={height} style={style}/>
			</Background>
		);

		return (
			<div>
				{canvas}

				<div
					ref={x => {
						this.element = x;
					}}
					style={{
						position: 'relative',
						zIndex: 1,
						// backgroundColor: 'gold',
					}}
				>
					{children}
				</div>
			</div>
		);
	}
}

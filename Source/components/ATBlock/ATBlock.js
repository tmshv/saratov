import React, {Component} from 'react';
import AttributesTable from '../AttributesTable';
import Canvas from '../Canvas';

export default class ATBlock extends Component {
	constructor(props) {
		super(props);
		this.onRectChange = this.onRectChange.bind(this);
		this.state = {
			rect: null,
		}
	}

	onRectChange(rect) {
		this.setState({
			rect,
		})
	}

	render() {
		const {attributes} = this.props;
		const {rect} = this.state;

		const canvas = !rect ? null : (
			<FF>
				<Canvas blur={15} width={rect.width} height={rect.height}/>
			</FF>
		);

		return (
			<Float top={15} right={15} ref={x => {
				this.element = x;
			}}>
				<div>
					{canvas}

					<div style={{
						position: 'relative',
						zIndex: 1,
					}}>
						<AttributesTable
							onRectChange={this.onRectChange}
							attributes={attributes}
						/>
					</div>
				</div>
			</Float>
		);
	}
}

class Float extends Component {
	render() {
		const {children, top, right} = this.props;
		return (
			<div style={{
				position: 'absolute',
				top: `${top}px`,
				right: `${right}px`,
			}}
			>
				{children}
			</div>
		)
	}
}

const FF = ({children}) => (
	<div style={{
		position: 'absolute',
		top: `${0}px`,
		left: `${0}px`,
	}}>
		{children}
	</div>
);

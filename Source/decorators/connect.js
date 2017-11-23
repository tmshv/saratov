import React, {Component} from 'react';

const defaultMapSignalToProps = data => data;

export default (signal, mapSignalToProps=defaultMapSignalToProps) => ComposedComponent => class extends Component {
	constructor(props) {
		super(props);
		this.onSignalUpdate = this.onSignalUpdate.bind(this);
	}

	componentDidMount() {
		this.signalIndex = signal.on(this.onSignalUpdate);
	}

	componentWillUnmount() {
		signal.off(this.signalIndex);
	}

	onSignalUpdate(data) {
		this.data = data;
		this.forceUpdate();
	};

	render() {
		const data = mapSignalToProps(this.data);
		const props = {
			...this.props,
			...data,
		};
		return <ComposedComponent {...props}/>;
	}
}

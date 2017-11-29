import React, {Component} from 'react';

const defaultMapSignalToProps = data => data;

export default (signal, mapSignalToProps = defaultMapSignalToProps, waitForSignal = false) => ComposedComponent => class extends Component {
	constructor(props) {
		super(props);
		this.onSignalUpdate = this.onSignalUpdate.bind(this);
	}

	componentDidMount() {
		if(signal) signal.on(this.onSignalUpdate);
	}

	componentWillUnmount() {
		if(signal) signal.off(this.onSignalUpdate);
	}

	onSignalUpdate(data) {
		this.data = data;
		this.forceUpdate();
	};

	render() {
		if (waitForSignal && !this.data) return null;

		const data = mapSignalToProps(this.data);
		const props = {
			...this.props,
			...data,
		};
		return <ComposedComponent {...props}/>;
	}
}

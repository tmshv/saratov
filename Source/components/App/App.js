import React, {Component} from 'react';
import AttributesTable from '../AttributesTable';
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

		return attributes
			? <AttributesTable attributes={attributes}/>
			: null;
	}
};
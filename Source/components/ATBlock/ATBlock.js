import React, {Component} from 'react';
import AttributesTable from '../AttributesTable';

export default class ATBlock extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);

		this.state = {
			folded: [false],
		}
	}

	onChange(folded) {
		this.setState({
			folded,
		})
	}

	render() {
		const {attributes} = this.props;
		const {folded} = this.state;

		return (
			<AttributesTable
				onChange={this.onChange}
				attributes={attributes}
				folded={folded}
			/>
		);
	}
}

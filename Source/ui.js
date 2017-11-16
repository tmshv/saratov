import React from 'react';
import {render} from 'react-dom';

const App = () => (
	<div>Hello</div>
)

const mountPoint = document.querySelector('#ui');
render(<App/>, mountPoint);
// import '../index.css';

import React from 'react';
import {render} from 'react-dom';
import App from './components/App';
import {setDefaults} from "./lib/settings";

const mountPoint = document.querySelector('#App');
render(<App/>, mountPoint);

setTimeout(() => {
	setDefaults();
}, 10);
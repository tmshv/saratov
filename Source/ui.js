import React from 'react';
import {render} from 'react-dom';
import App from './components/App';

const mountPoint = document.querySelector('#ui');
render(<App/>, mountPoint);
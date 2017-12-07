import React, {Component} from 'react';

const round = (value, n = 1) => Math.round(value * n) / n;
const value = (value, n) => {
	const v = parseFloat(value);
	return isNaN(v)
		? value
		: round(v, n)
};

const Value = ({units, children}) => (!units
		? `${children}`
		: <span>{children}&thinsp;{units}</span>
);

export default ({children, units}) => {
	return (
		<Value units={units}>{value(children, 1)}</Value>
	);
};

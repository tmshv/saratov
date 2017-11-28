import React, {Component} from 'react';

const round = (value, n = 1) => Math.round(value * n) / n;
const isNumber = value => typeof value === 'number';
const value = (value, n) => isNumber(value)
	? round(value, n)
	: value;

const Value = ({units, children}) => (!units
		? `${children}`
		: <span>{children}&thinsp;{units}</span>
);

export default ({children, units}) => {
	return (
		<Value units={units}>{value(children, 1)}</Value>
	);
};

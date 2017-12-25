import React, {Component} from 'react';

const Value = ({units, children}) => (!units
		? `${children}`
		: <span>{children}&thinsp;{units}</span>
);

export default ({children, units}) => {
	return (
		<Value units={units}>{children}</Value>
	);
};

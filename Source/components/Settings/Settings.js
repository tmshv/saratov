import React, {Component} from 'react';
import classNames from 'classnames';
import connect from '../../decorators/connect';
import {settingsSignal as signal} from '../../signals';

@connect(
	signal,
	settings => {
		return {
			shadows: settings.shadows,
			quality: settings.quality,
			onChangeShadow: value => {
				signal.trigger({
					...settings,
					shadows: value,
				});
			},
			onChangeQuality: event => {
				const quality = event.target.value;

				signal.trigger({
					...settings,
					quality,
				});
			},
		};
	},
	true,
)
export default class Settings extends Component {
	render() {
		const {shadows, onChangeShadow} = this.props;
		const {quality, onChangeQuality} = this.props;

		return (
			<div className={classNames('Settings', 'Block')}>
				<ul>
					<SettingsItem>
						<Checkbox
							checked={shadows}
							onChange={() => {
								onChangeShadow(!shadows);
							}}
						>
							Падающие тени
						</Checkbox>
					</SettingsItem>

					<SettingsItem>
						<Checkbox
							checked={true}
							enabled={false}
							onChange={() => {}}
						>
							Размытый фон
						</Checkbox>
					</SettingsItem>

					<SettingsItem>
						<Select
							value={quality}
							onChange={onChangeQuality}
							options={[
								{name: 'Хорошее качество', value: 1.0},
								{name: 'Среднее качество', value: 0.5},
								{name: 'Плохое качество', value: 0.25},
							]}
						/>
					</SettingsItem>
				</ul>
			</div>
		)
	}
};

const SettingsItem = ({checked, onChange, children}) => (
	<li className='SettingsItem'>
		{children}
	</li>
);

const Checkbox = ({onChange, checked, children, enabled=true}) => (
	<label>
		<input
			type="checkbox"
			checked={checked}
			disabled={!enabled}
			onChange={onChange}
		/>
		{children}
	</label>
);

const Select = ({onChange, value, options}) => (
	<div>
		<select onChange={onChange} value={value}>
			{
				options.map(({name, value}, i) => (
					<option
						value={value}
						key={i}
					>{name}</option>
				))
			}
		</select>
	</div>
);
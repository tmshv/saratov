import React, {Component} from 'react';
import classNames from 'classnames';
import connect from '../../decorators/connect';
import {settingsSignal as signal} from '../../signals';
import {setOptions, setQuality, getSettings} from '../../lib/settings';
import ViewportQuality from '../../models/ViewportQuality';

@connect(
	null,
	() => {
		const settings = getSettings();
		return {
			options: ViewportQuality.options,
			shadows: Boolean(settings.shadows),
			blurredBackground: Boolean(settings.blurredBackground),
			qualityMode: settings.qualityMode,
			onChangeShadow: value => {
				setOptions({
					shadows: value,
				});
			},
			onChangeBlurredBackground: value => {
				setOptions({
					blurredBackground: value,
				});
			},
			onChangeQuality: event => {
				const qualityMode = event.target.value;
				setQuality(qualityMode);
			},
		};
	}
)
export default class Settings extends Component {
	render() {
		const {shadows, onChangeShadow} = this.props;
		const {blurredBackground, onChangeBlurredBackground} = this.props;
		const {qualityMode, onChangeQuality} = this.props;
		const {options} = this.props;

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
							checked={blurredBackground}
							onChange={() => {
								onChangeBlurredBackground(!blurredBackground);
							}}
						>
							Размытый фон
						</Checkbox>
					</SettingsItem>

					<SettingsItem>
						<Select
							value={qualityMode}
							onChange={onChangeQuality}
							options={options}
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
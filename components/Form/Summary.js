class Summary extends React.Component {
	constructor(props) {
		super(props);
	}

	parseReadableValue(value, type) {
		let v = value || '';

		if (value.toString().toLowerCase() === 'true') {
			v = 'Yes';
		} else if (value.toString().toLowerCase() === 'false') {
			v = 'No';
		} else if (typeof value === 'string' && value.length > 0) {
			v = this.capitalizeFirstLetter(value);
			if (type === 'textarea') {
				v = `"${v}"`;
			} else if (type === 'month') {
				let month = value.match(/^[0-9]{4}-[0-9]{2}/);
				v = (month) ? month[0] : 'Invalid Month';
			}
		} else if (Array.isArray(value) && value.length > 0) {
			v = value.map(v => `"${this.capitalizeFirstLetter(v)}"`).join(', ');
		} else {
			v = '--';
		}

		return v;
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, ' ');
	}

	_transformFieldsets(data) {
		let model = JSON.parse(JSON.stringify(data));
		let values = {};

		Object.entries(model).forEach(([k,v]) => {
			let fieldsets;

			values[k] = [];
			Object.entries(v).forEach(([key,value]) => {
				if (value.fieldset) {
					let useChecked = (['radio', 'checkbox'].includes(value.type));
					if (useChecked && !value.checked) { return; }
					if (value.shown === false) { return; }

					fieldsets = fieldsets || {};

					var starter = (value.serialization === 'array') ? [] : {};
					let f = fieldsets[value.fieldset] || {};
					f.name = (value.meta && value.meta.summary) ? value.meta.summary.label || value.fieldset : value.fieldset;
					f.value = f.value || starter;
					f.shown = (typeof f === 'boolean') ? f.shown : value.shown;
					f.tabIndex = (Number.isInteger(f.tabIndex)) ? f.tabIndex : value.tabIndex;
	
					if (value.serialization === 'array') {
						f.value.push(value.value);
					} else {
						f[value.name || value.id].value = value.value;
					}

					return;
				}

				values[k].push(value);
			});

			if (fieldsets) {
				Object.values(fieldsets).forEach(f => values[k].push(f));
			}

			values[k].sort((a,b) => {
				return a.tabIndex - b.tabIndex;
			});
		});

		return values;
	}

	render() {
		let sections = [];

		Object.entries(this._transformFieldsets(this.props.data)).forEach(([key, values]) => {
			let questions = (
				<ul>
					{
						values.filter(v => v.shown).map(v => {
							let label;
							if (v.meta && v.meta.summary) {
								label = v.meta.summary.label;
							}
							return (
								<li key={v.name || v.id} data-value={v.name || v.id}>
									<div>{label || this.parseReadableValue(label || v.name || v.id)}</div>
									<div>{this.parseReadableValue(v.value, v.type)}</div>
								</li>
							);
						})
					}
				</ul>
			);

			sections.push((
				<div key={key}>
					<h4>{this.parseReadableValue(key)}</h4>
					{questions}
				</div>
			));
		});

		return (
			<React.Fragment>
				<h2>Summary</h2>
				{sections}
			</React.Fragment>
		)
	}
}

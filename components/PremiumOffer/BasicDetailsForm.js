class BasicDetailsForm extends React.Component {
	constructor(props) {
		super(props);
	}

	initialDataTransform(initialData) {
		if (!initialData['num_keys']) {
			initialData['num_keys0'] = 'none';
		} else {
			initialData['num_keys1'] = initialData['num_keys'].toString();
		}
		return initialData;
	}

	render() {
		return (
			<Form
				//update={this.update}
				name='basic_details'
				onMount={this.props.update}
				onBlur={this.props.update}
				onChange={this.props.update}
				//onFocus={this.update}
				initialData={this.props.initialData}
				initialDataTransform={this.initialDataTransform}
				persistEvents={false} // Has a performance impact, only use if you need event data
				visible={true}
			>	
				<React.Fragment>
					<h2>Basic details</h2>
					<h4>Does your car have any of these features?</h4>
					<Fieldset name="equipment" serialization="array">
						<input id="equipment_0" type="checkbox" value="sat_nav"/><label htmlFor="equipment_0">Sat nav</label>
						<input id="equipment_1" type="checkbox" value="panoramic_roof"/><label htmlFor="equipment_1">Panoramic roof / sun roof</label>
						<input id="equipment_2" type="checkbox" value="heated_seats"/><label htmlFor="equipment_2">Heated seats</label>
						<input id="equipment_3" type="checkbox" value="parking_cam"/><label htmlFor="equipment_3">Rear parking camera</label>
						<input id="equipment_4" type="checkbox" value="sound_system"/><label htmlFor="equipment_4">Upgraded sound system</label>
					</Fieldset>
					{
						/*
						// Example of serialization object
						<Fieldset name="equipment1" serialization="object">
							<input id="equipment_00" type="checkbox" value="sat_nav"/><label htmlFor="equipment_00">Sat nav</label>
							<input id="equipment_10" type="checkbox" value="panoramic_roof"/><label htmlFor="equipment_10">Panoramic roof / sun roof</label>
							<input id="equipment_20" type="checkbox" value="heated_seats"/><label htmlFor="equipment_20">Heated seats</label>
							<input id="equipment_30" type="checkbox" value="parking_cam"/><label htmlFor="equipment_30">Rear parking camera</label>
							<input id="equipment_40" type="checkbox" value="sound_system"/><label htmlFor="equipment_40">Upgraded sound system</label>
						</Fieldset>
						*/
					}

					<h4>What colour are the seats?</h4>
					<label>
						<select name="seat_color" required>
							<option value="" disabled="">Select a colour</option>
							{
								this.props.fields.seat_color.map(f => {
									return (<option key={f.value} name={f.value} value={f.value}>{f.text}</option>);
								})
							}
						</select>
					</label>

					<h4>How are they upholstered?</h4>
					<label className="select">
						<select name="seat_fabric" required>
							<option value="" disabled="">Select fabric</option>
							<option value="" disabled="">Select a colour</option>
							{
								this.props.fields.seat_fabric.map(f => {
									return (<option key={f.value} name={f.value} value={f.value}>{f.text}</option>);
								})
							}
						</select>
					</label>

					<h4>Do you have two working keys for the car?</h4>

					<input id="num_keys_0___0" type="radio" name="num_keys0" value="2" required/>
					<label htmlFor="num_keys_0___0">Yes</label>
					<input id="num_keys_1___0" type="radio" name="num_keys0" value="none" required/>
					<label htmlFor="num_keys_1___0">No</label>
					<Conditional
							name="num_keys0"
							condition={(input) => {
								return (input.checked && input.value === 'none');
							}}
						>
						<h4>How many working keys do you have?</h4>
						<input id="num_keys_0___1" type="radio" name="num_keys1" value="0" required />
						<label htmlFor="num_keys_0___1">None</label>
						<input id="num_keys_1___1" type="radio" name="num_keys1" value="1" required />
						<label htmlFor="num_keys_1___1">1</label>
						<input id="num_keys_2___1" type="radio" name="num_keys1" value="3" required />
						<label htmlFor="num_keys_2___1">3+</label>
					</Conditional>

					<h4>Do you have the V5C logbook?</h4>
					<input id="logbook_0" type="radio" name="logbook" value="true" required />
					<label htmlFor="logbook_0">Yes</label>
					<input id="logbook_1" type="radio" name="logbook" value="false" required />
					<label htmlFor="logbook_1">No</label>
					<Conditional
							name="logbook"
							condition={(input) => {
								return (input.checked && input.value === true);
							}}
						>
						<h4>Is the V5C logbook in your name?</h4>
						<input id="logbook_self_0" type="radio" name="logbook_self" value="true" required />
						<label htmlFor="logbook_self_0">Yes</label>
						<input id="logbook_self_1" type="radio" name="logbook_self" value="false" required />
						<label htmlFor="logbook_self_2">No</label>
					</Conditional>

					<h4>Do you have the book pack?</h4>
					<input id="book_pack_0" type="radio" name="book_pack" value="true" required/>
					<label htmlFor="book_pack_0">Yes</label>
					<input id="book_pack_1" type="radio" name="book_pack" value="false" required/>
					<label htmlFor="book_pack_1">No</label>
				</React.Fragment>
			</Form>
		);
	}
}
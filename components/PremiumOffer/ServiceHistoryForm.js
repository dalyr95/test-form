class ServiceHistoryForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Form
				//update={this.update}
				name='ServiceHistoryForm'
				onMount={this.props.update}
				onBlur={this.props.update}
				//onChange={this.update}
				//onFocus={this.update}
				persistEvents={false} // Has a performance impact, only use if you need event data
				visible={true}
			>	
				<h2>Service history</h2>
				<h4>What is the service history of your car?</h4>
				<input id="service_history_0" type="radio" name="service_history" value="yes"/>
				<label htmlFor="service_history_0">Full or partial service history</label>
				<input id="service_history_1" type="radio" name="service_history" value="no"/>
				<label htmlFor="service_history_1">No service history</label>
				<input id="service_history_2" type="radio" name="service_history" value="not_applicable"/>
				<label htmlFor="service_history_2">Not yet due first service</label>

				<h4>Do you have the service record?</h4>
				<input id="service_record_0" type="radio" name="service_record" value="true" />
				<label htmlFor="service_record_0">Yes</label>
				<input id="service_record_1" type="radio" name="service_record" value="false" />
				<label htmlFor="service_record_1">No</label>

				<Conditional
						name="service_record"
						condition={(input) => {
							return (input.checked && input.value === 'true');
						}}
					>
					<h4>How many services do you have recorded in the service record?</h4>

					<h6>Manufacturer or official dealer services:</h6>
					<label htmlFor="service_stamps_official">Manufacturer or official dealer services:</label>
					<input name="service_stamps_official" type="number" min="0" placeholder="0" value="0" />

					<h6>Independent garage services:</h6>
					<label htmlFor="service_stamps_independent">Manufacturer or official dealer services:</label>
					<input name="service_stamps_independent" type="number" min="0" placeholder="0" value="0" />
					
					<h4>When was the vehicle last serviced?</h4>
					<input name="service_date" type="month" min="2013-01" max="2018-11" value="2015-03" />

					<h4>What was the mileage at the last service?</h4>
					<input name="service_mileage" type="number" min="0" />

					<h4>Do you have the service record?</h4>
					<input id="cambelt_changed_0" type="radio" name="cambelt_changed" value="true"/>
					<label htmlFor="cambelt_changed_0">Yes</label>
					<input id="cambelt_changed_1" type="radio" name="cambelt_changed" value="false"/>
					<label htmlFor="cambelt_changed_1">No</label>

					<Conditional
							name="cambelt_changed"
							condition={(input) => {
								return (input.checked && input.value === 'true');
							}}
						>
							<h4>When was the cambelt changed?</h4>
							<input name="cambelt_change_date" type="month" min="2013-01" max="2018-11" value="" />

							<h4>What was the mileage when the cambelt was changed?</h4>
							<input id="cambelt_change_mileage" type="number" min="0" placeholder="0" value=""></input>
					</Conditional>
				</Conditional>
			</Form>
		);
	}
}
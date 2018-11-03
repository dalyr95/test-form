class PhotosForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Form
				//update={this.update}
				name='photos'
				onMount={this.props.update}
				onBlur={this.props.update}
				onChange={this.props.update}
				initialData={this.props.initialData}
				//onFocus={this.update}
				persistEvents={false} // Has a performance impact, only use if you need event data
				visible={true}
				seen={this.props.seen}
			>	
				<Field elements={[
					{element: 'input', name: 'hello1', type: 'checkbox', required: true, value: 1},
					{element: 'input', name: 'hello2', type: 'checkbox', required: true, value: 2},
				]}>
				{/* Doesn't like children for some reason.... */}
				</Field>
			</Form>
		);
	}
}
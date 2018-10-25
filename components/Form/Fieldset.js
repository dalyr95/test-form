class Fieldset extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<fieldset
				{...this.props}
			>
				{
					React.Children.map(this.props.children, (child) => {
						return React.cloneElement(child, {
							key: `${this.props.name}-${child.props.name}`,
							fieldset: this.props.name
						});
					})
				}
			</fieldset>
		);
	}
}
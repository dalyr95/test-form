class Field extends React.Component {
  constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		if (this.props.handleOwnPropagation !== true) {
			e.stopPropagation();
		}
	}

	render() {
		/**
		 * TODO - wrap in a fieldset and then stopPropagation??
		 * if (!prop.handleOwnPropagation) { <fieldset>updateParent(myself)</fieldset> }
		 */

		return (
			<fieldset onChange={this.onChange}>
				{
					React.Children.map(this.props.children, (child) => {
						let p = {};
						let {updateForm, ...props} = this.props;
						p = props;

						// In case anyone passed in a DOM element as a child
						if (typeof child.type !== 'string') {
							p.updateForm = updateForm;
						}

						// Pass `updateParent` to child component
						return React.cloneElement(child, {
							...child.props,
							...p
						});
					})
				}
			</fieldset>
		);
  }
}

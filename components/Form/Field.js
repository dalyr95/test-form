class Field extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
		<React.Fragment>
			{

				React.Children.map(this.props.children, (child) => {
					// In development environment
					if (typeof window === "object" && window.location.port) {
						['onChange', 'onBlur'].forEach(on => {
							if (child.type.prototype[on]) {
								if (!child.type.prototype[on].toString().includes('stopPropagation')) {
									console.warn('If changing `input` values programtically, be sure to include `event.stopPropagation()` and call `this.props.updateForm(e, value)` when complete.')
								}
							}
						});
					}

					return React.createElement(child.type, {
						...child.props,
						...this.props
					});
				})
			}
		</React.Fragment>
    );
  }
}

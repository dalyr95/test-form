class Form extends React.Component {
	constructor(props) {
		super(props);

		window.Offer = window.Offer || {};
		window.Offer[this.props.name] = this;

		this.$form = React.createRef();

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this._ParseDom = this._ParseDom.bind(this);
		this._getDOMAttributes = this._getDOMAttributes.bind(this);
		this._getReactProps = this._getReactProps.bind(this);
		//
		this.updateModel = this.updateModel.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.report = this.report.bind(this);

		this._DOM = {};
		this._ReactDOM = {};

		this._formElementTypes = [
			//'button',
			//'datalist',
			Field, // Custom Element Component 
			'fieldset',
			'form',
			'input',
			'keygen',
			//'label',
			'legend',
			'meter',
			//'optgroup',
			//'option',
			'output',
			'progress',
			'select',
			'textarea'
		];

		this.state = {
			seen: {}
		};

		this.__Model = {};
		this.__ValueModel = {};

		if (!this.props.onChange && !this.props.onBlur) {
			console.warn(`No \`onChange\` or \`onBlur\` handlers are provided for \`<Form/>\` name \`${this.props.name}\`. Are you sure?`);
		}

		if (!this.props.name) {
			console.warn(`No \`name\` prop for \`<Form/>\` component. Are you sure?`);
		}
	}

	_ParseDom() {
		let $form = this.$form.current;
		let $elements = [...$form.elements];

		$elements.forEach($el => {
			let attributes = this._getDOMAttributes($el);
			this._DOM = this.updateModel(attributes['name'], attributes, this._DOM);
		});
	}

	_getDOMAttributes($el) {
		let attributes = {};
		let attrs = $el.attributes;
		for(var i = attrs.length - 1; i >= 0; i--) {
			attributes[attrs[i].name] = attrs[i].value;
		}

		attributes['checked'] = $el.checked;
		attributes['value'] = $el.value;

		return attributes;
	}

	_getReactProps($el, parentProps) {
		if (this._formElementTypes.includes($el.type)) {
			let valid = true;
			let value = $el.props.defaultValue || '';

			/**
			 * TODO - Beef this up abit, possibly use pattern?
			 */
			if ($el.props.required) {
				if (value === '') {
					valid = false;
				}

				if (['radio', 'checkbox'].includes($el.props.type)) {
					valid = $el.props.checked || false;
				}
			}

			let attributes = {
				checked: $el.props.checked || false,
				type: $el.type,
				value: value,
				valid: valid,
				...$el.props,
				...parentProps || {}
			}

			return attributes;
		}
	}

	_parseDOMAttributesToReactProps(dom) {
		/**
		 * `required` attribute comes back as `required === ''`
		 */
		dom.required = (dom.required != null) ? true : dom.required;
		if (dom.value && ['true', 'false'].includes(dom.value)) {
			dom.value = JSON.parse(dom.value);
		}
		return dom;
	}

	componentDidMount() {
		if (this.props.initialData) {
			this.hydrate(this.props.initialData);
		}
		if (this.props.onMount) { this.props.onMount({type: 'mount'}, this.report())}
	}

	onBlur(e) {
		if (this.props.persistEvents) { e.persist(); }

		this.setState({
			$focused: null
		});

		if (this.props.onBlur) { this.props.onBlur(e, this.report()); }
	}

	onFocus(e) {
		if (this.props.persistEvents) { e.persist(); }

		this.setState({
			seen: {...this.state.seen, [e.target.name]: true},
			$focused: e.target
		});

		if (this.props.onFocus) { this.props.onFocus(e, this.report()); }
	}

	onChange(e, value) {
		if (this.props.persistEvents) { e.persist(); }

		//this._DOM = this.updateModel(e.target.name, this._getDOMAttributes(e.target), this._DOM);
		let DOMAttributes = this._parseDOMAttributesToReactProps(this._getDOMAttributes(e.target));
		DOMAttributes.HTMLvalid = e.target.checkValidity();
		DOMAttributes.value = value || DOMAttributes.value;

		let name = this.generateFetchName(DOMAttributes);

		if (!name) {
			console.error(`Element \`${DOMAttributes.type}\` does not have a name or id`, DOMAttributes);
			return;
		}

		let model = this.__resolveModelPath(name, this.__Model);
		model = mergeDeep(model, DOMAttributes);

		this.__Model = this.updateModel(name, model, this.__Model);

		if (!model) {
			console.error(`Could not find a model to change for \`${name}\``);
			return;
		}

		if (model.fieldset) {
			let fieldsetName = model.fieldset;
			let fieldset = this.__resolveModelPath(fieldsetName, this.__ValueModel);
			let useChecked = ['radio', 'checkbox'].includes(model.type);

			if (model.serialization === 'array') {
				let arr;
				if (useChecked) {
					if (model.checked) {
						fieldset.push(model.value);
						arr = fieldset;
					} else {
						arr = fieldset.filter(f => {
							return (f !== model.value)
						});
					}
					
					this.updateModel(fieldsetName, arr, this.__ValueModel);
				} else {
					/**
					 * TODO - Sort this condition out
					 */
				}
			} else {
				let vector = (model.value) ? model.value : null;

				if (useChecked) {
					if (model.checked) {
						fieldset[name] = model.value;
					} else {
						delete fieldset[name];
					}
				} else {
					if (vector) {
						fieldset[name] = model.value;
					} else {
						delete fieldset[name];
					}
				}

				this.updateModel(fieldsetName, fieldset, this.__ValueModel);
			}
		} else {
			this.updateModel(name, model.value, this.__ValueModel);
		}

		if (this.props.onChange) { this.props.onChange(e, this.report()); }

		this.setState({
			model: this.__Model
		}, () => {
			this.onUpdate();
		});
	}

	onSubmit(e) {
		if (this.props.persistEvents) { e.persist(); }

		e.preventDefault();

		if (this.props.onSubmit) { this.props.onSubmit(e, this.report()); }
	}

	onUpdate() {
		console.log('onUPPPPPPDATE!!', this);
		if (this.props.update) { this.props.update(null, this.report()); }
	}

	report() {
		let model = JSON.parse(JSON.stringify(this.__ValueModel));

		return {
			data: model,
			name: this.props.name,
			progress: this._progress
		};
	}

	hydrate(hydrateData) {
		if (this.props.initialDataTransform) {
			hydrateData = this.props.initialDataTransform(hydrateData);
		}

		let getModel = (_ReactProps, model) => {
			if (!_ReactProps) { return; }

			let name = this.generateFetchName(_ReactProps);

			return this.__resolveModelPath(name, model) || {};
		};

		let updateModel = (_ReactProps) => {
			if (!_ReactProps) { return; }

			let name = this.generateFetchName(_ReactProps);

			if (_ReactProps.fieldset) {
				let fieldset = this.__resolveModelPath(_ReactProps.fieldset, hydrateData) || {};
				let modelModel = getModel(_ReactProps, this.__Model);
				let valueModel = getModel(_ReactProps.fieldset, this.__ValueModel);

				if (Array.isArray(fieldset)) {
					// Assuming fieldset arrays would be checkboxes as it's a boolean essentially
					fieldset.forEach(f => {
						if (_ReactProps.value === f) {
							modelModel.checked = true;
							valueModel.push(modelModel.value);
						}
					});
				} else {
					Object.entries(fieldset).forEach(([key, value]) => {
						if (name === key) {
							model.value = value;
							if (['radio', 'checkbox'].includes(model.type)) {
								model.checked = true;
							}
						}
					})
				}
			} else {
				let model = getModel(_ReactProps, this.__Model);

				/**
				 * TODO - Should we add to model anyway???
				 * Could be picked up on a later DOM run
				 */
				if (!model) { return; }

				let dataModel = this.__resolveModelPath(name, hydrateData);

				if (['radio', 'checkbox'].includes(model.type)) {
					model.checked = (typeof dataModel != null) ? true : false;
				}
				// Allow for default values if the API returns null
				model.value = dataModel || _ReactProps.value || '';
			}
		}

		let generateModel = (children, mergeParentProps) => {
			// Traverse through all children with pretty functional way :-)
			return React.Children.map(children, (child) => {
				// This is support for non-node elements (eg. pure text), they have no props
				if (!child || !child.props) {
					return child;
				}

				let _ReactProps = this._getReactProps(child, mergeParentProps);

				// If current component has additional children, traverse through them as well!
				if (child.props.children) {
					let parentProps;

					// Don't care about error or conditionals here, just parse the children, find form elements

					// Get the fieldset and assign it to the child
					if (child.type === Fieldset) {
						parentProps = {};
						parentProps = Object.assign(mergeParentProps || {}, {
							fieldset: child.props.name,
							serialization: child.props.serialization
						});
					}

					/**
					 * TODO - Reset any values in conditionals if closed?
					 */

					updateModel(_ReactProps);
					generateModel(child.props.children, parentProps)
					return;
				}

				updateModel(_ReactProps);
			});
		}

		generateModel(this.props.children);

		this.setState({
			model: this.__Model
		});
	}

	generateFetchName = (_ReactProps) => {
		return (typeof _ReactProps === 'string') ? _ReactProps : _ReactProps.name || _ReactProps.id;
	}

	render() {
		let formElements = [];
		let completedFormElements = 0;

		let updateModel = (_ReactProps) => {
			if (!_ReactProps) { return; }
			
			let name = this.generateFetchName(_ReactProps);

			let existingModel = getModel(_ReactProps);

			if (Object.keys(existingModel || {}).length > 0) { return; }

			if (!name) {
				console.error(`Element \`${_ReactProps.type}\` does not have a name or id`, _ReactProps);
				return;
			}

			// Remove anything not needed
			let {children, ..._Props} = _ReactProps;

			this.updateModel(name, _Props, this.__Model);

			if (_Props.fieldset) {
				let fieldset = getModel(_Props.fieldset);

				if (Array.isArray(fieldset) || Object.keys(fieldset).length === 0) {
					fieldset = (_Props.serialization === 'array') ? [] : {};
				}

				this.updateModel(_Props.fieldset, fieldset, this.__ValueModel);
			} else {
				let value = (['radio', 'checkbox'].includes(_Props.type)) ? _Props.checked : (_Props.value) ? _Props.value : null;
				this.updateModel(name, value, this.__ValueModel);
			}
		};

		let getModel = (_ReactProps) => {
			if (!_ReactProps) { return; }

			let name = this.generateFetchName(_ReactProps);

			return this.__resolveModelPath(name, this.__Model) || {};
		};

		let generateModel = (children, mergeParentProps) => {
			// Traverse through all children with pretty functional way :-)
			return React.Children.map(children, (child) => {
				// This is support for non-node elements (eg. pure text), they have no props
				if (!child || !child.props) {
					return child;
				}
				
				let _ReactProps = this._getReactProps(child, mergeParentProps);

				// If current component has additional children, traverse through them as well!
				if (child.props.children) {
					let parentProps;

					// Don't care about error or conditionals here, just parse the children, find form elements
					
					// Get the fieldset and assign it to the child
					if (child.type === Fieldset) {
						parentProps = {};
						parentProps = Object.assign(mergeParentProps || {}, {
							fieldset: child.props.name,
							serialization: child.props.serialization
						});
					}

					/**
					 * TODO - Reset any values in conditionals if closed?
					 */

					updateModel(_ReactProps);
					generateModel(child.props.children, parentProps)
					return;
				}

				updateModel(_ReactProps);
			});
		}

		let renderWrappedChildren = (children) => {
			// Traverse through all children with pretty functional way :-)
			return React.Children.map(children, (child) => {
				
				// This is support for non-node elements (eg. pure text), they have no props
				if (!child || !child.props) {
					return child;
				}

				let _ReactProps = this._getReactProps(child);
				let _values = getModel(_ReactProps);

				let inputState = {};
				let customProps = {};

				if (_values) {
					// Do something if need be

					if (child.type === 'input' && ['radio', 'checkbox'].includes(child.props.type)) {
						if (child.props.type === 'radio' && _values.checked) {
							inputState.checked = (_values.value != null) ? (_values.value.toString() === child.props.value.toString()) : false;
						} else {
							inputState.checked = (_values.value != null) ? _values.checked || _ReactProps.checked : false;
						}
					} else {
						inputState.value = _values.value || '';
						inputState.checked = _values.checked;
					}
				}

				if (child.type === Error || child.type === Conditional) {
					let _values = getModel({
						name: child.props.name
					});

					customProps.input = _values || {};
				}

				if (child.type === Field) {
					customProps.updateForm = this.onChange;
				}

				// If current component has additional children, traverse through them as well!
				if (child.props.children) {
					// You have to override also children here
					return React.cloneElement(child, {
						children: renderWrappedChildren(child.props.children),
						onChange: child.props.onChange || (() => {}),
						...customProps,
						...inputState
					});
				}

				// Return new component with overridden `onChange` callback
				return React.cloneElement(child, {
					onChange: child.props.onChange || (() => {}),
					...customProps,
					...inputState
				});
			});
		}
		
		let time = performance.now();
		
		let children;

		if (this.props.children) {
			generateModel(this.props.children);
			children = renderWrappedChildren(this.props.children);
		}

		console.info(`Render time: ${Math.round(performance.now() - time)}ms`);

		this._progress = {
			total: formElements.length,
			completed: completedFormElements,
			percentage: Math.round((completedFormElements / formElements.length) * 100)
		};
		
		// Remove any reserved props such as update
		let {update, persistEvents, onMount, visible, initialData, initialDataTransform, updateForm, ...props} = this.props;

		if (!this.props.children || this.props.visible === false) {
			return (null);
		}

		return (
			<form
				ref={this.$form}
				{...props}
				onChange={this.onChange}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				onSubmit={this.onSubmit}
				//onInvalid={this.onChange}
				noValidate
			>
				{ children }
			</form>
		);
	}

	updateModel(path='', value, obj={}, separator='.') {
		var properties = Array.isArray(path) ? path : path.split(separator);

		properties.reduce((prev, curr, i) => {
			if (!prev[curr]) { prev[curr] = {}; }
			if (i === properties.length - 1) { prev[curr] = value; }
			return prev && prev[curr];
		}, obj);

		return obj;
	}

	__resolveModelPath(path='', obj=self, separator='.') {
		var properties = Array.isArray(path) ? path : path.split(separator);
		if (properties[0] === 'fieldset') { properties.shift(); }
		return properties.reduce((prev, curr) => prev && prev[curr], obj)
	}
}
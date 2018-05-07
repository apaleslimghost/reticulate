export const link = (obj, prop, {initializer}) => ({
	enumerable: true,
	get() {
		const Type = initializer();
		const instance = Type.from ? Type.from(this.constructor, this)
			: new Type(this);

		return instance.fetch ? instance.fetch()
		     : instance.toJSON ? instance.toJSON()
		     : instance;
	}
});

export const items = Type => (obj, prop, {value}) => ({
	value: async (...args) => (await value(...args)).map(
		item => new Type(item)
	)
});

class Collection {
	constructor(data) {
		this.data = data;
	}

	find(query = {}) {
		const items = this.data.filter(item =>
			Object.keys(query).every((key) => item[key] === query[key])
		);
		return Promise.resolve(items);
	}

	findOne(query) {
		const item = this.data.find(item =>
			Object.keys(query).every((key) => item[key] === query[key])
		);

		if (!item) {
			return Promise.reject(new Error('No matching item found'));
		}

		return Promise.resolve(item);
	}

	insertOne(item) {
		this.data.push(item);

		return Promise.resolve({ result: {ok: 1, n: 1 }, ops: [item] });
	}

	updateOne(query, update) {
		const item = this.data.find(item =>
			Object.keys(query).every((key) => item[key] === query[key])
		);

		if (!item) {
			return Promise.reject(new Error('No matching item found to update'));
		}

		const index = this.data.indexOf(item);

		this.data[index] = { ...this.data[index], ...update };

		return Promise.resolve({ result: { ok: 1, nModified: 1 }, matchedCount: 1, modifiedCount: 1 });
	}

	deleteOne(query) {
		const index = this.data.findIndex(item => item.id === query.id);

		if (index === -1) {
			return Promise.reject(new Error('No matching item found'));
		}

		this.data.splice(index, 1);

		return Promise.resolve({ result: { ok: 1, n: 1 }, deletedCount: 1 });
	}
}

module.exports = Collection;

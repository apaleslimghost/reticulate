import {link, items, get} from './';
import Struct from '@quarterto/struct';
import promiseAllObject from '@quarterto/promise-all-object';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms, true));

class Vehicle extends Struct('registration') {
	static from(type, instance) {
		switch(type) {
			case Arrival:
				return new Vehicle(instance.registration);
		}
	}
}

class Arrival extends Struct('due', 'registration') {
	@link vehicle = Vehicle;
}
class Line extends Struct('name') {}

class Arrivals extends Struct('stopPoint') {
	@items(Arrival)
	async fetch() {
		await delay(2000);
		return [
			{due: 1234, registration: 'AB12CDE'},
			{due: 2345, registration: 'AB12CDE'},
		];
	}
}

class Lines extends Struct('stopPoint') {
	@items(Line)
	async fetch() {
		await delay(2000);
		return [
			{name: '343'},
			{name: '136'},
		];
	}
}

class StopPoint {
	@link arrivals = Arrivals;
	@link lines = Lines;
}

process.on('unhandledRejection', e => {
	console.error(e.stack);
});

const a = new StopPoint();

(async function() {
	const b = await a.arrivals;
	console.log(await Promise.all(b.map(promiseAllObject)));
})();

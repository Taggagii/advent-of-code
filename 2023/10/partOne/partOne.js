const fs = require('node:fs');

const findS = (values) => {
	return values.reduce((coords, line, lineIndex) => {
		const index = line.findIndex((value) => value === 'S');

		if (index !== -1) {
			coords[0] = index;
			coords[1] = lineIndex;
		}

		return coords;
	}, [-1, -1]);
}

const Directions = Object.freeze({
	UP: Symbol('up'),
	DOWN: Symbol('down'),
	LEFT: Symbol('left'),
	RIGHT: Symbol('right'),
});

const Lbend = (direction) => {
	switch (direction) {
		case Directions.DOWN: {
			return Directions.RIGHT;
		} case Directions.LEFT: {
			return Directions.UP;
		}
	}

	return false
}

const sevenBend = (direction) => {
	switch (direction) {
		case Directions.RIGHT: {
			return Directions.DOWN;
		} case Directions.UP: {
			return Directions.LEFT;
		}
	}
	return false
}

const JBend = (direction) => {
	switch (direction) {
		case Directions.DOWN: {
			return Directions.LEFT;
		} case Directions.RIGHT: {
			return Directions.UP;
		}
	}

	return false
}

const FBend = (direction) => {
	switch (direction) {
		case Directions.LEFT: {
			return Directions.DOWN;
		} case Directions.UP: {
			return Directions.RIGHT;
		}
	}

	return false
}

const horizontalPipe = (direction) => {
	if ([Directions.LEFT, Directions.RIGHT].includes(direction)) {
		return direction;
	}
	return false;
}

const verticalPipe = (direction) => {
	if ([Directions.UP, Directions.DOWN].includes(direction)) {
		return direction;
	}
	return false;
}

const pipeDirectionMutator = (direction, pipe) => {
	switch (pipe) {
		case "7": {
			return sevenBend(direction);
		} case "J": {
			return JBend(direction);
		} case "F": {
			return FBend(direction);
		} case "L": {
			return Lbend(direction);
		} case ".": {
			return false;
		} case "-": {
			return horizontalPipe(direction);
		} case "|": {
			return verticalPipe(direction);
		} default: { // if it's already visited it'll be a number
			return false;
		}
	}
}

const parseInput = (s, values) => {

	const unitOffsets = [
		{
			direction: Directions.DOWN,
			offset: [0, 1]
		},
		{
			direction: Directions.UP,
			offset: [0, -1]
		},
		{
			direction: Directions.RIGHT,
			offset: [1, 0]
		},
		{
			direction: Directions.LEFT,
			offset: [-1, 0]
		},
	];

	const directionOffsetMap = unitOffsets.reduce((prev, cur) => {
		prev[cur.direction] = cur.offset;
		return prev;
	}, {});

	const insideDimensions = (coordinate) => {
		const [x, y] = coordinate;
		const dimensionsX = values[0].length;
		const dimensionsY = values.length;

		return x >= 0 && y >= 0 && x < dimensionsX && y < dimensionsY
	}

	const applyOffset = (coordinate, offset) => [coordinate[0] + offset[0], coordinate[1] + offset[1]];
	 
	values[s[1]][s[0]] = 0;

	// console.log(s)
	// console.log(values);

	const queue = unitOffsets
		.map((offset) => ({
			coordinate: applyOffset(s, offset.offset),
			direction: offset.direction,
			distance: 1,
		}))
		.filter((coord) => insideDimensions(coord.coordinate));

	let greatestDistance = 0;

	while (queue.length) {
		const path = queue.shift();
		const [x, y] = path.coordinate;
		const pipe = values[y][x];

		const mutation = pipeDirectionMutator(path.direction, pipe);

		const offset = directionOffsetMap[mutation];

		// console.log();
		// console.log('handing new path:', path);
		// console.log('the pipe were handing:', pipe)
		// console.log('The mutation output is:', mutation);
		// console.log('new offset', offset);
		//
		if (!offset) {
			// console.log('Interesting, we dont have an offset to apply')
			continue;
		}

		const newCoordinate = applyOffset(path.coordinate, offset);
		// console.log('The new coordinate is:', newCoordinate);

		values[y][x] = path.distance;
		greatestDistance = Math.max(greatestDistance, path.distance);

		path.distance += 1;
		path.coordinate = newCoordinate;
		path.direction = mutation;

		queue.push(path);
	}

	console.log(values.map((l) => l.join('')).join('\n'));
	console.log(`The largest distance was ${greatestDistance}`);
}

// const input = fs.readFileSync('sampleInput.txt', 'utf8');
const input = fs.readFileSync('input.txt', 'utf8');

const inputValues = input.trim().split('\n').map((line) => line.trim().split(''));

const s = findS(inputValues);

const parsedInput = parseInput(s, inputValues);



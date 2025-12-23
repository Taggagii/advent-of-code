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

	values[s[1]][s[0]] = '$';

	// console.log(s)
	// console.log(values);

	const queue = [unitOffsets[0]]
		.map((offset) => ({
			coordinate: applyOffset(s, offset.offset),
			direction: offset.direction,
			distance: 1,
		}))
		.filter((coord) => insideDimensions(coord.coordinate))

	let greatestDistance = 0;

	while (queue.length) {
		console.log()
		const path = queue.shift();
		const [x, y] = path.coordinate;
		const pipe = values[y][x];
		if (pipe === 'S') {
			console.log('ayyyy');
			continue;
		}

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

		values[y][x] = '$';
		console.log(values.map((l) => l.join('')).join('\n'));
		greatestDistance = Math.max(greatestDistance, path.distance);

		path.distance += 1;
		path.coordinate = newCoordinate;
		path.direction = mutation;

		queue.push(path);
	}

	// console.log(values.map((l) => l.join('')).join('\n'));
	// console.log(`The largest distance was ${greatestDistance}`);
	return values;
}

const spreadTheInfection = (startingPoint, input, infectionSymbol = 'O') => {
	const stack = [startingPoint];

	const offsets = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	];

	while (stack.length) {
		const [x, y] = stack.pop();
		// console.log(x, y)

		if (!(x >= 0 && y >= 0 && y < input.length && y < input[0].length)) {
			// console.log('out of range')
			continue;
		}

		if (input[y][x] !== '.') {
			// console.log('cant transmit')
			continue;
		}

		input[y][x] = infectionSymbol;

		offsets.forEach(([ox, oy]) => {
			// console.log(`Calculating new coordinate: starting with ${x} ${y} adding ${ox} ${oy} ending with ${x + ox} ${y + oy}`)
			stack.push([x + ox, y + oy]);
		});
	}

}

const extendWalls = (input) => {
	const width = input[0].length;
	input.push('.'.repeat(width).split(''));
	input.unshift('.'.repeat(width).split(''));

	for (let i = 0; i < input.length; ++i) {
		input[i].push('.');
		input[i].unshift('.');
	}

	return input;
}

// const input = fs.readFileSync('inputOne.txt', 'utf8');
// const input = fs.readFileSync('inputTwo.txt', 'utf8');
const input = fs.readFileSync('inputThree.txt', 'utf8');
// const input = fs.readFileSync('inputFour.txt', 'utf8');
// const input = fs.readFileSync('input.txt', 'utf8');

const values = input.trim().split('\n').map((line) => line.trim().split(''));
const originalValues = input.trim().split('\n').map((line) => line.trim().split(''));

const s = findS(values);

const parsedInput = parseInput(s, values);

for (let i = 0; i < parsedInput.length; ++i) {
	for (let ii = 0; ii < parsedInput[i].length; ++ii) {
		if (parsedInput[i][ii] !== '$') {
			parsedInput[i][ii] = '.'
		} else {
			parsedInput[i][ii] = originalValues[i][ii];
		}
	}
}

// console.log(parsedInput.map((l) => l.join('')).join('\n'))

extendWalls(parsedInput);
spreadTheInfection([0, 0], parsedInput, 'O');

// console.log(parsedInput.map((l) => l.join('')).join('\n'))

let insideTiles = 0;
for (let i = 0; i < parsedInput.length; ++i) {
	for (let ii = 0; ii < parsedInput[i].length; ++ii) {
		if (parsedInput[i][ii] === '.') {
			// spreadTheInfection([ii, i], parsedInput, "I");
			parsedInput[i][ii] = '\u001b[34mI\u001b[0m';
			insideTiles += 1;
		}
	}
}

console.log(parsedInput.map((l) => l.join('')).join('\n').replaceAll('$', 'i').replaceAll('O', 'O').replaceAll('.', '.'))
console.log(`There are ${insideTiles} inside tiles`);







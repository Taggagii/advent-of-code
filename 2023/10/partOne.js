const { dir } = require('node:console');
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
	if (direction.LEFT || direction.RIGHT) {
		return direction;
	}
	return false;
}

const verticalPipe = (direction) => {
	if (direction.UP || direction.DOWN) {
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
		}
	}

	throw new Error("I'm sorry but I don't recognize that type of pipe");
}

const parseInput = (s, values) => {
	console.log(s)
	console.log(values);

	const unitOffsets = [
		[0, 1],
		[0, -1]
		[1, 0],
		[-1, 0],
	];

	const insideDimensions = (coordinate) => {
		const [x, y] = coordinate;
		const dimensionsX = values[0].length;
		const dimensionsY = values.length;

		return x >= 0 && y >= 0 && x < dimensionsX && y > dimensionsY
	}

	const queue = unitOffsets
		.map(([x, y]) => [s[0] + x, s[1] + y])
		.filter((coord) => insideDimensions(coord));

	console.log(queue);
}

const input = fs.readFileSync('sampleInput.txt', 'utf8');

const inputValues = input.trim().split('\n').map((line) => line.trim().split(''));

const s = findS(inputValues);

const parsedInput = parseInput(s, inputValues);



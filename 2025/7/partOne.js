const fs = require("node:fs");

const findYThatSplits = (startX, startY, rows) => {
	for (let y = startY; y < rows.length; ++y) {
		if (rows[y][startX] === '^') {
			return y;
		}
	}
	return undefined;
}


const addNode = (graph, x, y, left, right) => {
	graph[[x, y]] = {
		left, right,
	}
}

const graphAlreadyContains = (graph, x, y) => Object.prototype.hasOwnProperty.call(graph, [x, y]);


const buildGraph = (rows) => {
	const graph = {};

	const sx = rows[0].findIndex(char => char === 'S');
	const sy = 0;
	addNode(graph, sx, sy, undefined, undefined)

	const sourceSplitY = findYThatSplits(sx, sy, rows);
	addNode(graph, sx, sourceSplitY, undefined, undefined);
	graph[[sx, sy]].left = [sx, sourceSplitY];

	const splitsToHandle = [[sx, sourceSplitY]];

	while (splitsToHandle.length) {
		const [splitX, splitY] = splitsToHandle.pop();

		const leftX = splitX - 1
		const leftY = findYThatSplits(leftX, splitY, rows);

		const rightX = splitX + 1;
		const rightY = findYThatSplits(rightX, splitY, rows);


		if (leftY !== undefined && !graphAlreadyContains(graph, leftX, leftY)) {
			addNode(graph, leftX, leftY, undefined, undefined);
			graph[[splitX, splitY]].left = [leftX, leftY];
			splitsToHandle.push([leftX, leftY]);
		}

		if (rightY !== undefined && !graphAlreadyContains(graph, rightX, rightY)) {
			addNode(graph, rightX, rightY, undefined, undefined);
			graph[[splitX, splitY]].right = [rightX, rightY];
			splitsToHandle.push([rightX, rightY]);

		}
	}
	return graph;
}

const numberOfSplits = (graph) => {
	return Object.keys(graph).length - 1;
}

// const input = fs.readFileSync(`${__dirname}/tree.txt`, 'utf8');
const input = fs.readFileSync(`${__dirname}/realTree.txt`, 'utf8');
// console.log(input)

// parse into a graph
const rows = input.split('\n').map((row) => row.split(''))


const graph = buildGraph(rows);

console.log(numberOfSplits(graph))









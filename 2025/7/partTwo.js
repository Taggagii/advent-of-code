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


		if (leftY !== undefined) {
			addNode(graph, leftX, leftY, undefined, undefined);
			graph[[splitX, splitY]].left = [leftX, leftY];
			splitsToHandle.push([leftX, leftY]);
		}

		if (rightY !== undefined) {
			addNode(graph, rightX, rightY, undefined, undefined);
			graph[[splitX, splitY]].right = [rightX, rightY];
			splitsToHandle.push([rightX, rightY]);

		}
	}
	return {
		source: [sx, sy],
		graph
	};
}

const addParentsToGraph = (graph) => {
	Object.keys(graph).forEach((node) => graph[node].parents = []);

	Object.keys(graph).forEach((parent) => {
		const parentNode = graph[parent];

		if (parentNode.left) {
			graph[parentNode.left].parents.push(parent);
		}

		if (parentNode.right) {
			graph[parentNode.right].parents.push(parent);
		}
	});
}

const numberOfSplits = (graph) => {
	return Object.keys(graph).length - 1;
}

const populateNumberOfUniquePaths = (graph) => {
	const leaves = Object.keys(graph).filter((node) => {
		graph[node].uniquePaths = 0;
		graph[node].timesVisited = 0;
		graph[node].requiredVisits = Boolean(graph[node].left) + Boolean(graph[node].right);
		graph[node].handled = false;

		if (!(graph[node].left || graph[node].right)) {
			graph[node].uniquePaths = 1;
			return true
		}

		return false;
	});


	const stack = leaves;

	while (stack.length) {
		console.log(stack)
		const node = stack.shift();
		console.log('handling', node)

		if (graph[node].timesVisited !== graph[node].requiredVisits) {
			console.log(`can't handle yet`)
			continue;
		}

		if (graph[node].handled) {
			console.log(`already handled`)
			continue;
		}

		graph[node].handled = true;

		graph[node].parents.forEach((parent) => {
			graph[parent].uniquePaths += graph[node].uniquePaths;
			graph[parent].timesVisited += 1;

			stack.push(parent);
		});
	}

	return graph;
}

const printGraph = (graph, source) => {
	console.log(Object.keys(graph))

	const dimension = Object.keys(graph).reduce((max, node) => {
		const nodeNumbers = node.split(',').map((n) => parseInt(n));
		return Math.max(...nodeNumbers, max);
	}, 0) + 2;

	const board = [];
	for (let i = 0; i < dimension; ++i) {
		const temp = [];
		for (let ii = 0; ii < dimension; ++ii) {
			temp.push('.')
		}
		board.push(temp)
	}


	board[source[1]][source[0]] = 'S';

	Object.keys(graph).forEach((node) => {
		const [x, y] = node.split(',').map((n) => parseInt(n));

		if (x === source[0] && y === source[1]) {
			return;
		}

		board[y][x] = '^';

		for (let iterY = y; iterY < rows.length; ++iterY) {
			board[iterY][x + 1] = '|';

			if (graph[[x + 1 iterY]]) {
				return;
			}
		}

		for (let iterY = y; iterY < rows.length; ++iterY) {
			board[iterY][x - 1] = '|';

			if (graph[[x - 1, iterY]]) {
				return;
			}
		}

	});



	console.log(board.map((row) => row.join('')).join('\n'))


}

const input = fs.readFileSync(`${__dirname}/othertree.txt`, 'utf8');
// const input = fs.readFileSync(`${__dirname}/realTree.txt`, 'utf8');
// console.log(input)

// parse into a graph
const rows = input.split('\n').map((row) => row.split(''))


const { source, graph } = buildGraph(rows);

printGraph(graph, source)

console.log(graph)

// console.log(source);
// Object.keys(graph).forEach((node) => console.log(node, graph[node]))
// console.log("-----------")


// addParentsToGraph(graph);
// Object.keys(graph).forEach((node) => console.log(graph[node].parents));

// console.log(graph)

//
// populateNumberOfUniquePaths(graph);

// console.log('after unique counting')
// Object.keys(graph).forEach((node) => {
// 	console.log(node, graph[node].uniquePaths, Boolean(graph[node].left), Boolean(graph[node].right))
// })

// console.log(graph[source]);













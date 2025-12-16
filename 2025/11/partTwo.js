const input = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

const graphNodeTemplate = (childrenValues, parentValues) => ({
	children: childrenValues ?? [],
	parents: parentValues ?? [],
	related: {},
});

const graph = input.split('\n').reduce((graph, node) => {
		const [name, childrenString] = node.split(':');
		const children = childrenString.trim().split(' ');

		return {
				...graph,
				[name]: graphNodeTemplate(children, []),
		};
}, {});

const addParents = (graph) => {
	Object.keys(graph).forEach((parentName) => {
		const parent = graph[parentName];
		parent.children.forEach((childName) => {
			if (!Object.prototype.hasOwnProperty.call(graph, childName)) {
				graph[childName] = graphNodeTemplate([], []);
			}

			graph[childName].parents.push(parentName);
		});
	});
}


const populateRelated = (graph, from, reverse = false) => {
	const edge = [from]

	const relative = `${from}-${reverse ? 'ancestor' : 'descendant'}`

	while (edge.length) {
		// console.log(edge);
		const edgeName = edge.pop();

		if (!Object.prototype.hasOwnProperty.call(graph, edgeName)) {
			graph[edgeName] = graphNodeTemplate([], []);
		}

		const edgeNode = graph[edgeName];

		if (edgeNode.related[relative]) {
			continue;
		}

		edgeNode.related[relative] = true;

		const neighbourDirection = reverse ? 'parents' : 'children';
		edgeNode[neighbourDirection].forEach((relativeName) => {
			edge.push(relativeName);
		});
	}
}

const removeNodeFromGraph = (graph, nameToRemove) => {
	delete graph[nameToRemove];

	Object.keys(graph).forEach((nodeName) => {
		graph[nodeName].children = graph[nodeName].children.filter((childName) => childName !== nameToRemove);
		graph[nodeName].parents = graph[nodeName].parents.filter((parentName) => parentName !== nameToRemove);
	});
}

const filterNotRelated = (graph, to) => {
	const ancestor = `${to}-ancestor`;
	const descendant = `${to}-descendant`;
	Object.keys(graph).forEach((nodeName) => {
		if (!(graph[nodeName].related[ancestor] || graph[nodeName].related[descendant])) {
			removeNodeFromGraph(graph, nodeName);
		}

	});
}

const printGraph = (graph) => {
	Object.keys(graph).forEach((nodeName) => console.log(nodeName));
	console.log();
}

const countUniquePathsFrom = (graph, from, reverse) => {


	const neighbourDirection = reverse ? 'parents' : 'chlidren';
	const edge = [from];
	while (edge.length) {

	}

}


addParents(graph);
console.log('starting graph')
printGraph(graph)

populateRelated(graph, 'svr');
filterNotRelated(graph, 'svr');
console.log('touched by the server')
printGraph(graph)

populateRelated(graph, 'fft', true);
populateRelated(graph, 'fft');
filterNotRelated(graph, 'fft')
console.log('touched by fft')
printGraph(graph)


populateRelated(graph, 'dac', true);
populateRelated(graph, 'dac');
filterNotRelated(graph, 'dac')
console.log('touched by dac')
printGraph(graph)


// populateRelated(graph, 'fft', true);
// populateRelated(graph, 'fft');
// console.log('fft touched');
// console.log(graph)
// filterNotRelated(graph, 'fft');
// console.log('filtering for fft')
// printGraph(graph)
//
// // populateRelated(graph, 'dac');
// // populateRelated(graph, 'dac', true);
// // filterNotRelated(graph, 'dac');
// // console.log('filtering for dac')
// // printGraph(graph)
//

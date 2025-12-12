const input = '[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}';
const matches = input.match(/\[.*\] (\(.*\)+) (\{.*\})/);

const buttons = matches[1].split(' ').map((button) => {
		const links = button.match(/(\d)/g).map((link) => parseInt(link, 10));
		return links;
});

const outputs = matches[2].match(/\d+/g).map((output) => parseInt(output, 10));



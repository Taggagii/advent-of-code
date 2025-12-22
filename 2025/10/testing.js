const input = '[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}';
const matches = input.match(/\[.*\] (\(.*\)+) (\{.*\})/);

const buttons = matches[1].split(' ').map((button) => {
		const links = button.match(/(\d)/g).map((link) => parseInt(link, 10));
		return links;
});

const outputs = matches[2].match(/\d+/g).map((output) => parseInt(output, 10));

const states = [[outputs, new Array(buttons.length).fill(0)]];

while (states.length) {
		console.log(states);
		const [state, pushes] = states.pop();

		for (let buttonIndex = 0; buttonIndex < buttons.length; ++buttonIndex) {
				const button = buttons[buttonIndex];
				const tempState = [...state];
				++pushes[buttonIndex];
				let invalid = false;

				for (let linkIndex = 0; linkIndex < button.length; ++linkIndex) {
						const link = button[linkIndex];
						--tempState[link];
						if (tempState[link] < 0) {
								invalid = true;
								break;
						}
				}

				if (tempState.reduce((p, v) => p + v, 0) === 0) {
						console.log(tempState);
						console.log(pushes);
						throw new Error('done');
				}
		 

				if (!invalid) {
						states.push([tempState, pushes]);
				}
		}
}







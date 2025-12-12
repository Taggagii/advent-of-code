const input = '[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}';
const matchOutput = input.match(/\[.*\] (.*)+ ({.*})/);

const buttonsRaw = matchOutput[1];
const desiredRaw = matchOutput[2];

const buttons = buttonsRaw.split(' ').map((button) => {
		const links = button.match(/(\d)+/g).map((link) => parseInt(link, 10))
		return links;
})

const desired = desiredRaw.match(/(\d)+/g).map((output) => parseInt(output, 10));

console.log(buttons);
console.log(desired);


// const buttons = matchOutput[1];
// const outputs = matchOutput[2]; 
// console.log(buttons);
// console.log(outputs);

// const inputImportant = input.slice(input.findIndex(']'));

// console.log(inputImportant);

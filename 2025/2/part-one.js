const inputValues = `82853534-82916516,2551046-2603239,805115-902166,3643-7668,4444323719-4444553231,704059-804093,32055-104187,7767164-7799624,25-61,636-1297,419403897-419438690,66-143,152-241,965984-1044801,1-19,376884-573880,9440956-9477161,607805-671086,255-572,3526071225-3526194326,39361322-39455443,63281363-63350881,187662-239652,240754-342269,9371-26138,1720-2729,922545-957329,3477773-3688087,104549-119841`;

// const inputValues = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`

const ranges = inputValues.split(',').map((range) => range.split('-'));
console.log(ranges);


let runningSum = 0;
const middleValues = [];

ranges.forEach(([start, end]) => {
	if (start.length % 2 && end.length % 2) {
		console.log(start, end, 'values are odd length')
		return [];
	}

	const startNumber = parseInt(start);
	const endNumber = parseInt(end);
 
	if (start.length % 2 === 0) {
		startHalf = parseInt(start.slice(0, start.length / 2));
	} else {
		startHalf = parseInt(start.slice(0, Math.max(1, Math.floor(end.length / 2) - 1)));
	}

	console.log('range:', startNumber, endNumber);
	console.log('starting half:', startHalf);

	for (let i = startHalf; true; ++i) {
		const middleNumber = parseInt(`${i}${i}`);
		if (middleNumber >= startNumber) {
			if (middleNumber <= endNumber) {
				middleValues.push(middleNumber);
				runningSum += middleNumber;
				console.log('valid:', middleNumber);
			} else {
				console.log(middleNumber, 'is too big');
				break;
			}
		} else {
			console.log(middleNumber, 'is too small');
		}
	}

	console.log();
});

console.log(JSON.stringify(middleValues, null, 2));
console.log(runningSum);
console.log(middleValues.reduce((prev, cur) => prev + cur, 0));

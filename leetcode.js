var canFormArray = function(arr, pieces) {
    const map = new Map();

    for (const piece of pieces) {
        map.set(piece[0], piece);
    }
    const result = [];
    for (const element of arr) {
        if (map.has(element)) {
            result.push(...map.get(element));
        } else {
            return false;
        }
    }
    return JSON.stringify(result) === JSON.stringify(arr);
};
let out = canFormArray([91,4,64,78],[[78],[4,64],[91]]);
console.log(out);


const users = [
    {firstName:"akshay", lastName:"saini", age:26},
    {firstName:"donald", lastName:"trumph", age:75},
    {firstName:"elon", lastName:"musk", age:50},
    {firstName:"deepika", lastName:"padukone", age:26},
]

const output = users.reduce(function (acc, curr) {
    if (curr.age < 30) {
        acc.push(curr.firstName);
    }
    return acc;
}, []);

console.log(output);
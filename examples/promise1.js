function promise1() {
    console.log("entered promise1 function");
    return new Promise((resolve, reject) => {
        console.log("inside new promise() 1");
        console.log("before st1");
        /*setTimeout(function () {
            console.log("setTimeout1 executed");
        }, 0);*/
        console.log("after st1");
        reject("message from promise1");
        console.log("after resolve() 1");
    })
}

function promise2(response) {
    console.log("entered promise2 function");
    return new Promise((resolve, reject) => {
        console.log("inside new promise() 2");
        console.log("promise1 message: " + response);
        console.log("before st2");
        /*setTimeout(function () {
            console.log("setTimeout2 executed");
        }, 0);*/
        console.log("after st2");
        resolve("promise 2 completed");
        console.log("after resolve() 2");
    })
}

promise1().then((response) => {
    console.log("into then for promise1 function..");
    return promise2(response);
}).then((response2) => {
    console.log("into then for promise2 function..");
    console.log("response from promise 2 function: " + response2);
});

console.log("line1");
console.log("line2");
console.log("line3");
console.log("....");
console.log("....");
console.log("....");
console.log("last line");
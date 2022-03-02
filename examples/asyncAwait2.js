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
  });
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
  });
}

async function doWork() {
  try {
    console.log("inside doWork");
    const response1 = await promise1();
    console.log("promise1() result came");
    console.log("promise1() message: " + response1);
    const response2 = await promise2(response1);
    console.log("promise2() result came");
    console.log("promise2() message: " + response2);
  } catch (err) {
    console.log("catch message: " + err);
  }
}

doWork();
console.log("line1");
console.log("line2");
console.log("line3");
console.log("....");
console.log("....");
console.log("....");
console.log("last line");

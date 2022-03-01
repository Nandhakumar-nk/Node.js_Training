function counter() {
    var count = 0;

    return function incrementCounter() {
        count++;
        console.log(count);
    }
}

counter1 = counter();
counter1();
counter1();

var counter2 = counter();
counter2();
counter2();
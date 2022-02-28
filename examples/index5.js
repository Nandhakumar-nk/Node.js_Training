function z() {
    var b = 900;
    function x() {
        var a = 7;
        function y() {
            console.log(a,b);
        }
        return y;
    }
    return x();
}

var p = z();
p();

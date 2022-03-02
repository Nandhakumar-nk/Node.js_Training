const name1 = {
  firstName: "Akshay",
  lastName: "Saini",
  printFullName: function() {
      console.log(this.firstName + " " + this.lastName);
  }
};

name1.printFullName();

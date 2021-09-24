function outer(){
    let outerVar=10;
    console.log("outer function called");
    return function inner(secondNum){
        console.log("inner function called");
        return outerVar+secondNum;
    }
}
let innerFnRef=outer();
console.log("between");
let rval=innerFnRef(20);
console.log("rval",rval);
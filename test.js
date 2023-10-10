function add(num1,num2) {
    return new Promise((resolve,reject) => {
        if(num1 == 0) {
            reject('The first number is zero');
        }else{
            resolve(num1+num2);
        }
    })
}
function mul(num1,num2) {
    return new Promise((resolve,reject) => {
        if(num1 == 0) {
            reject('The first number is zero');
        }else{
            resolve(num1*num2);
        }
    })
}
add(10,30).then((res) => {
    console.log(res);
    return mul(res,res).then((output) => {
        console.log(output);
    }).catch((error) => {
        console.log(error);
    })
}).catch((err) => {
    console.log(err);
})
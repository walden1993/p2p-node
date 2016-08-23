/**
 * Created by Administrator on 2016/8/10.
 */
'use strict'

function say(){
    console.log('hello you');
}

var hello = Object.create({say:say});

delete hello.say;

hello.say();

var arr = [1,2,3,4,5];

arr = arr.map(function(v){
    return v*1
});
console.log(arr);

arr = arr.filter(function(v){
    return v>3;
})
console.log(arr)
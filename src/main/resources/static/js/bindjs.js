/**
 *@program: demo2
 *@author Cen Shijian
 *@description
 *@date 2019/4/20 9:18
 */
'use strict';
(function ($) {
    /*
    var obj={
        name:'123'
    };
    function fun() {
        var args=Array.prototype.slice.call(arguments);
        var o=args.shift();
        args.concat(Array.prototype.slice.call(arguments));
        return args;
    }
    var arr1=fun(obj,'1235','bnhs');
    */
    Function.prototype.curry=function(){
        var fn=this;
        var args=Array.prototype.slice.call(arguments);
        return function () {
            return fn.apply(this,args.concat(Array.prototype.slice.call(arguments)));
        };
    };
    function myFun(params){
        return 'Hello word'+params;
    }
    Function.prototype.partial=function () {
        var fn=this,args=Array.prototype.slice.call(arguments);//定义函数时的参数
        return function () {
            var arg=0;//调用时的函数
            for(var i=0;i<args.length && arg<arguments.length;i++){
                if(args[i]===undefined){
                    args[i]=arguments[arg++];
                }
            }
            return fn.apply(this,args);
        };
    };
    String.prototype.csv=String.prototype.split.partial(/,\s*/);
    var results=('Mugan,jia,fun').csv();
    if(results[0]=='Mugan'){
        console.log(results[0]);
    }
    if(results[1]=='jia'){
        console.log(results[1]);
    }
    if(results[2]=='fun') {
        console.log(results[2]);
    }
    var bindClick=document.body.addEventListener.partial('click',undefined,false);
    bindClick(function () {
        console.log('单击绑定成功!');
    });
    var delay=setTimeout.partial(undefined,10);
    delay(function () {
        console.log('Hi,I love you!')
    })
})(jQuery, $);

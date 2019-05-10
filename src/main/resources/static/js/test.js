/**
 *@program: demo2
 *@author Cen Shijian
 *@description
 *@date 2019/4/14 12:09
 */
'use strict';
(function ($) {
    function bind(context, name) {
        return function () {
            return context[name].apply(context, arguments);
        };
    }

    var button = {
        clicked: false,
        click: function () {
            this.clicked = true;
            if (button.clicked) {
                console.log("The button has been Clicked");
            }
        }
    };
    var elem = document.getElementById("test");
    elem.addEventListener("click", bind(button, "click"), false);
    Function.prototype.bind = function () {
        var fn = this, args = Array.prototype.slice.call(arguments),
            Object = args.shift();
        return function () {
            return fn.apply(Object,
                args.concat(Array.prototype.slice.call(arguments)));
        }
    }

    var myObject = {};

    function myFunction(a,b) {
        console.log(a+b);
        return this == myObject;
    }

    var aFun = myFunction.bind(myObject,'123','abc');
    if (aFun()) {
        console.log("Context is myObject");
    }
})
(jQuery, $);

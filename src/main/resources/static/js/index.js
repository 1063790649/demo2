/**
 *@program: demo2
 *@author Cen Shijian
 *@description
 *@date 2019/4/14 11:18
 */
'use strict';
;(function ($) {
    var outerValue = 'nana';
    var later;

    function outerFun() {
        var linnerValue = 'samurai';

        function innerFun(params) {
            if (outerValue == 'nana') {
                console.log('I see the nana');
            }
            if (linnerValue = 'samurai') {
                console.log('I see the samurai');
            }
            if(params){
                console.log("I see the params");
            }
            if(toolist){
                console.log("I see the toolist");
            }
        }

        later = innerFun;
    }
    if(!toolist){
        console.log("I can not see the toolist");
    }
    var toolist="hahaha";
    outerFun();
    later("params");
})(jQuery);
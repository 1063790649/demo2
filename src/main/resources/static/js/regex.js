/**
 *@program: demo2
 *@author Cen Shijian
 *@description
 *@date 2019/4/25 22:54
 */
'use strict';
(function ($) {
    var string='filter:alpha(opacity=25)';
    var arr=string.match(/opacity=([^)]+)/);
    for(var i=0;i<arr.length;i++){
        console.log(arr[i]);
    }
})(jQuery, $);

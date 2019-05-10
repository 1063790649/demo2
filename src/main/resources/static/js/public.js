"use strict";
//jQuery.noConflict();
//刷新下拉框
function comboReload() {
    $(this).parent().parent().siblings('.easyui-combobox').combobox('reload');
}

//如果不存在 console 则重写  console
(function (window,$) {
    window.console = window.console || (function () {
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'];
        var _console = {};
        for (var i in methods) {
            _console[methods[i]] = function () {
                return false;
            };
        }
        return _console;
    })();
    //格式化输出字符串
    String.prototype.fmt = function () {
        var args = arguments;
        var str = this;
        for (var i = 0; i < args.length; i++) {
            str = str.replace('\{' + (i) + '\}', args[i]);
        }
        return str;
    }
    window.JSTool = (function () {
        //判断数组
        function isEmpty_many() {
            //方法参数的个数
            var args = arguments;
            for (var i in  args) {
                if (this.isEmpty(args[i])) {
                    return true;
                }
            }
            return false;
        }

        //判断字符串和对象
        function isEmpty_one(val) {
            if (this.isString(val)) {
                return null === val || val === '' || val.length === 0;
            } else if (this.isObject(val)) {
                return null === val || JSON.stringify(val) === '{}';
            }
            return false;
        }

        return {
            isEmpty: function () {
                return arguments.length === 1 ? isEmpty_one.apply(this,
                    arguments) : isEmpty_many.apply(this, arguments);
            },
            isNotEmpty: function () {
                return !this.isEmpty(arguments);
            },
            isInFram: function () {
                return window.top.location.href !== window.location.href;
            },
            isArray: function (val) {
                return $.isArray(val);
            },
            isFunction: function (val) {
                return typeof val === 'function';
            },
            isString: function (val) {
                return typeof val === 'string'
            },
            isObject: function (val) {
                return typeof val === 'object';
            },
            isNumber: function (val) {
                return typeof val === 'number';
            },
            isBoolean: function (val) {
                return typeof val === 'boolean';
            },
            //格式化字符串
            format: function () {
                var args = arguments;
                var str = args[0];
                for (var i = 1; i < args.length; i++) {
                    str = str.replace('\{' + (i - 1) + '\}', args[i]);
                }
                return str;
            },
            //JSON对象追加数据
            extend: function (target, source) {
                for (var key in source) {
                    target[key] = source[key];
                }
                return target;
            },
            //添加空格
            space: function (num) {
                var space = '';
                for (var i = 0; i < (num || 1); i++) {
                    space += '&nbsp;';
                }
                return space;
            },
            formatServerDate: function (num, format) {
                return num && (function () {
                    var date = new Date(num);
                    var year = date.getFullYear();
                    var month = (date.getMonth() + 1);
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    return (format || 'yyyy-MM-dd').replace('yyyy', year)
                        .replace('MM', (month < 10) ? '0' + month : month)
                        .replace('dd', (day < 10) ? '0' + day : day)
                        .replace('HH', (hour < 10) ? '0' + hour : hour)
                        .replace('mm', (minute < 10) ? '0' + minute : minute)
                        .replace('ss', second < 10 ? '0' + second : second);
                })();
            },
            getCurrentDate: function (format) {
                return this.formatServerDate(new Date().getTime(), format);
            },
            //{}生成对象添加方法
            //fun.length是方法fun()的参数个数
            addMethod: function (object, funName, fun) {
                var l1 = fun.length;
                var l2 = arguments.length;
                var old = object[funName];
                object[funName] = function () {
                    //fun参数相同则执行新增加方法
                    if (fun.length === arguments.length) {
                        fun.apply(this, arguments);
                        //参数不同则执行旧方法
                    } else if (JSTool.isFunction(old)) {
                        old.apply(this, arguments);
                    }
                }
            },
            isContainArray: function (arr, val) {
                if (arr.length === 0) {
                    return false;
                } else {
                    for (var i in arr) {
                        if (val === arr[i]) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            //生产UUID号码
            guid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (substring) {
                    var rand = Math.random() * 16 | 0;
                    var v = substring == 'x' ? rand : (rand & 0x3 | 0x8);
                    return v.toString(16);
                })
            }
        }

    })();
    //封装操作表单方法
    window.MyForm = function (formSelector) {
        var $form = $(formSelector), onsubmit;
        //按钮添加方法（提交，重置，清空）
        $form.find('.form-submit').on('click', function () {
            if (JSTool.isFunction(onsubmit)) {
                //验证数据的有效性
                if (onsubmit.apply($form, new Array())) {
                    $form.form('submit');
                }
            } else {
                $form.form("submit");
            }
        });
        $form.find('.form-clear').on('click', function () {
            $form.form("clear");
        });
        $form.find('.form-reset').on('click', function () {
            $form.form('reset');
        });
        //对表单元素的操作方法
        var myForm = {
            bindBtn: function () {
                return this.bindEvent.apply(this, arguments);
            },
            bindEvent: function (selected, etype, fun) {
                $form.find(selected).on(etype, fun);
                return this;
            },
            //ajax提交表单
            bindForm: function (url, callback) {
                $form.form({
                    url: url,
                    onSubmit: function () {
                        if ($form.form('validate')) {
                            Msg.loading();
                            return true;
                        } else {
                            return false;
                        }
                    },
                    success: function (data) {
                        Msg.loadingClose();
                        try {
                            var res = $.parseJSON(data);
                            if (res.auth) {
                                if (callback) {
                                    callback.call($form, res);
                                } else {
                                    if (res.succ) {
                                        Msg.success(res.msg);
                                    } else {
                                        Msg.warning(res.msg)
                                    }
                                }
                            } else {
                                Msg.warning(res.msg)
                            }
                        } catch (e) {
                            Msg.error(e.message);
                        }
                    }
                });
                return this;
            },
            reset: function () {
                $form.form('reset');
                return this;
            },
            load: function (pojo) {
                $form.form('load', pojo);
                return this;
            },
            //验证数据的有效性
            onSubmit: function (callback) {
                onsubmit = callback;
                return this;
            },
            clear: function () {
                $form.form('clear');
                return this;
            },
            serialize: function () {
                return $form.serialize();
            },
            //decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码
            decodeSerialize: function () {
                return window.decodeURIComponent(this.serialize())
            },
            formData: function () {
                var ser = this.decodeSerialize();
                var arr1 = ser.split('&');
                var data = {};
                for (var i in arr1) {
                    var e = arr[i];
                    var h = e.split('=');
                    var key = h[0];
                    var value = h[1];
                    if (data.hasOwnProperty(key)) {
                        var sz = new Array();
                        var value1 = data[key];
                        if (JSTool.isString(value1)) {
                            sz.push(value1);
                            sz.push(value);
                            data[key] = sz;
                        } else if (JSTool.isArray(value1)) {
                            data[key].push(value)
                        }
                    } else {
                        data[key] = value;
                    }
                }
                return data;
            },
            $form: $form
        }
        return myForm;
    }
    // 封装easyUi dataGrid
    window.Grid = function (selector) {
        var CurrentGrid = null, gridOption = new GridOption();
        //GridOption对象
        //grid处理传入参数类
        function GridOption() {
            var toolbarbtns = new Array();
            //数据立即加载
            this.loadNow = true;
            //功能按钮样式
            this.buttonToolPlain=false;
            //搜索框按钮样式
            this.buttonSearchPlain=false;

            //添加按钮
            function toolBtn_2(text, handler) {
                toolBtn_3(text, null, handler);
            }

            function toolBtn_3(text, iconCls, handler) {
                toolbarbtns.push({
                    text: text,
                    iconCls: iconCls,
                    handler: handler,
                    plain: false
                });
                toolbarbtns.push('-')
                return this;
            }

            //toolBtn也是GridOption的属性
            JSTool.addMethod(this, 'toolBtn', toolBtn_2);
            JSTool.addMethod(this, 'toolBtn', toolBtn_3);
            this.primaryKey = 'guid';
            this.showCkBox = true;
            this.toolbarbtnsArr = toolbarbtns;
            //删除数据表格的一行数据
            //arg是url
            this.toolRemove = function (arg) {
                if (JSTool.isString(arg)) {
                    return this.toolBtn('删除', 'icon-remove', function () {
                        var pkStr = CurrentGrid.getSelectedGuidsStr();
                        if (pkStr) {
                            Msg.confirm(function (r) {
                                if (r) {
                                    Http.post(arg, {giuds: pkStr}, function (res) {
                                        if (res.succ) {
                                            Msg.success(res.msg);
                                            CurrentGrid.reload();
                                        } else {
                                            Msg.warning();
                                        }
                                    });
                                }
                            });
                        } else {
                            Msg.warning(Msg.UNSELECTED);
                        }
                    })
                } else if (JSTool.isFunction(arg)) {
                    return this.toolBtn('删除', 'icon-remove', arg);
                }
            }
            //数据网格参数
            this.options = {
                singleSelect: false,
                url: null,
                columns: null,
                rowStyler: null,
                method: 'POST',
                rownumbers: true,
                footer: null,
                toolbar: null,
                collapsible: true,
                pagination: true,
                pageList: [5, 10, 20, 50, 100, 1000, 10000, 100000],
                pageSize: 20,
                pageNumber: 1,
                fitColumns: true
            };
            //设置列的参数cols列的参数
            this.setCols = function (cols) {

                if (this.showCkBox) {
                    cols[0].splice(0, 0, {
                        field: 'ckbox',
                        checkbox: true
                    });
                }
                //设置列的宽度
                //checkbox列的宽度
                for (var i in cols[0]) {
                    var col = cols[0][i];
                    if (col.field === 'ckbox') {
                        col.width = '30px';
                        continue;
                    }
                    //自定义列宽度
                    if (col.hasOwnProperty('width')) {
                        if (JSTool.isNumber(col.width)) {
                            if (col.width > 0) {
                                col.width = col.width + 'px';
                            }
                        }
                        continue;
                    }
                    //标题列的宽度
                    if (col.hasOwnProperty('title')) {
                        col['width'] = (col.title.length * 20) + 'px';
                    }
                }
                this.options.columns = cols;
            }
            //在toolbar添加按钮
            this.getOptions = function () {
                if (toolbarbtns.length > 0) {
                    this.options.toolbar = toolbarbtns;
                }
                return this.options;
            }
            //根据条件查询数据表内容
            var queryControl, queryControlObj, controlContainer;
            this.ntqc = false;//表示通过json 的方式配置查询列
            this.setQueryControl = function () {
                if (arguments.length == 1) {
                    controlContainer = '#control-container';
                    queryControlObj = arguments[0];
                } else {
                    controlContainer = arguments[0];
                    queryControlObj = arguments[1]
                }
                this.ntqc = true;
            }

            this.getQueryControl = function () {
                return queryControlObj &&
                    (queryControl || (queryControl = new QueryControl(controlContainer, queryControlObj)));
            }
            var _toolbars = null;
            this.ntd = false;//表示需要用到默认的生成控件的方式而不是 自定义 toolbar
            this.setToolbars = function (toolbars) {
                _toolbars = toolbars;
                this.ntd = true;
            }
            this.getToolbars = function () {
                _toolbars.selector = _toolbars.selector || '#toolbar-grid';
                return new toolbars(_toolbars.selector, _toolbars);
            }

            //*/*/*/*
            //封装查询按钮和查询条件
            //自定义样式
            var getStyleStr = function (style) {
                var styleStr = '';
                if (style) {
                    if (!style.hasOwnProperty('width')) {
                        style.width = '120px';
                    }
                    for (var key in style) {
                        var val = style[key];
                        styleStr += key + ':' + val + ';';
                    }
                } else {
                    styleStr = 'width:120px';
                }
                return styleStr;
            };

            function bindCtrl($dom, fdesc) {
                if ($dom.length > 0) {
                    var options = fdesc.options;
                    switch (fdesc.type) {
                        case 'text':
                            $dom.textbox(options);
                            break;
                        case 'date':
                            $dom.datebox(options);
                            break;
                        case 'select':
                            if (JSTool.isArray(fdesc.val)) {
                                options.data = fdesc.val;
                            }
                            $dom.combobox(options);
                            break;
                        case 'number':
                            $dom.numberbox(options);
                            break;
                        case 'numberspinner':
                            $dom.numberspinner(options);
                            break;
                        case 'datetimespinner':
                            $dom.datetimespinner(options);
                            break;
                        case 'datetime':
                            $dom.datebox(options);
                            break;
                        case 'combotree':
                            $dom.combotree(options);
                            break;
                        default:
                    }
                }
            }

            function getCtrlHtml(field, fdesc) {
                var domStr = "", ctrlCls = CtrlCls[fdesc.type], styleStr = getStyleStr(fdesc.style);
                if (fdesc.between) {
                    var fields = field.splice(',');
                    domStr += getInput(fields[0]);
                    domStr += '-';
                    domStr += getInput(fields[1]);
                } else {
                    domStr = getInput(field);
                }

                function getInput(field) {
                    return JSTool.format(CtrlCls.inputTag, ctrlCls, field, field + '-input-group',
                        styleStr, '', '');
                }

                return domStr;
            }
            //输入框样式参数
            function extend(source) {
                var fd = {
                    type: 'text',
                    label: undefined,
                    val: '',
                    between: false,
                    style: undefined,
                    options: undefined,
                    //模糊查询标识
                    mhcx: false
                };
                for (var key in source) {
                    //覆盖默认值
                    if (fd.hasOwnProperty(key)) {
                        fd[key] = source[key];
                    }
                }
                return fd;
            }

            var CtrlCls = {
                inputTag: '<input class="{0}" name="{1}" id="{2}" style="{3}" value="{4}" title="{5}"/>',
                searchBtnTag: '',
                date: 'easyui-datebox',
                text: 'easyui-textbox',
                select: 'easyui-combobox',
                number: 'easyui-numberbox',
                numberspinner: 'easyui-numberspinner',
                datetimespinner: 'easyui-datetimespinner',
                datetime: 'easyui-datetimebox',
                combotree: 'easyui-combotree'
            };
            //*/*/77
            var searchBtnTmp = '<a href="javascript:void(0);" class="easyui-linkbutton" id="{0}" iconCls="{1}">{2}</a>';
            var toolbar_grid_div = '<div id="toolbar-grid" ></div>';
            var tool_btn_group_div = '<div id="toolbar-btn-group"><fieldset class="scheduler-border"><legend class="scheduler-border">选择操作</legend><table cellspacing="0" cellpadding="2" border="0" ><tbody><tr></tr></tbody></table></fieldset></div>';
            var toolbar_input_group_div = '<div id="toolbar-input-group"><fieldset class="scheduler-border"><legend class="scheduler-border">条件查询</legend><table cellspacing="0" cellpadding="2" border="0" width="100%"><tbody></tbody></table></fieldset></div>';
            var tool_linkbtn_tag = '<a id="{2}" href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:\'{0}\',plain:true">{1}</a>';

            //生产按钮工具栏
            function toolbars(containerSelector, toolbars) {
                this.containerSelector = containerSelector;
                var $toolbarContaier = $(containerSelector);
                var $toolBtnGroupDiv = $(tool_btn_group_div);
                var $toolInputGroupDiv = $(toolbar_input_group_div);
                var initToolbarBtnGroup = null;
                if (toolbars.hasOwnProperty('toolBtnGroup')) {
                    var hasBtn = false;
                    function addBtn1(text, icon, fn, id) {
                        var btnId = '';
                        var separatorTdId = '';
                        if (id) {
                            btnId = _toolbars.selector.substring(1, _toolbars.length) + '-toolbar-btn-' + id;
                            separatorTdId = _toolbars.selector.substring(1, _toolbars.length) + '-separatorTdId-' + id;
                            var toolLinkbtn = JSTool.format(tool_linkbtn_tag, icon, text, btnId);
                            var $td = $('<td></td>'),
                            $td1 = $('<td id="' + separatorTdId + '"><div class="datagrid-btn-separator"></div></td>');
                            var $tlb = $(toolLinkbtn);
                            $tlb.on('click', fn);
                            $td.append($tlb);
                            //添加按钮
                            var $tr = $toolBtnGroupDiv.find('tr');
                            //按钮
                            $tr.append($td);
                            //分隔符
                            $tr.append($td1)
                            $tlb.linkbutton({plain:gridOption.buttonToolPlain});
                            hasBtn = true;
                        }
                    }

                    var btnid = 0;

                    function addBtn2(text,icon,fn) {
                        addBtn1(text, icon, fn, 'b' + (btnid++));
                    }

                    var toolbar = {};
                    JSTool.addMethod(toolbar, 'addBtn', addBtn1);
                    JSTool.addMethod(toolbar, 'addBtn', addBtn2);
                    var tool_btn_group = toolbars.toolBtnGroup;
                    for (var key in tool_btn_group) {
                        //处理函数
                        var tool_btn = tool_btn_group[key];
                        switch (key) {
                            case 'add':
                                toolbar.addBtn('增加', 'icon-save', tool_btn);
                                break;
                            case 'edit':
                                toolbar.addBtn('编辑', 'icon-edit', tool_btn);
                                break;
                            case 'remove':
                                if (JSTool.isString(tool_btn)) {
                                    var delurl = tool_btn;
                                    toolbar.addBtn('删除', 'icon-remove', function () {
                                        var pkStr = CurrentGrid.getSelectedGuidsStr();
                                        if (pkStr) {
                                            Msg.confirm(function (r) {
                                                if (r) {
                                                    Http.post(delurl, {'id': pkStr}, function (res) {
                                                        if (res.succ) {
                                                            Msg.success(res.msg, function () {
                                                                CurrentGrid.reload();
                                                            });
                                                        } else {
                                                            Msg.warning(res.msg);
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            Msg.warning(Msg.UNSELECTED);
                                        }
                                    })
                                } else if (JSTool.isFunction(delurl)) {
                                    toolbar.addBtn('删除', 'icon-remove', tool_btn)
                                }
                                break;
                            case 'print':
                                toolbar.addBtn('打印', 'icon-print', tool_btn);
                                break;
                            case 'see':
                                toolbar.addBtn('查看', 'icon-eye', tool_btn);
                                break;
                            case 'detail':
                                toolbar.addBtn('详情', 'icon-eye', tool_btn);
                                break;
                            case 'excelExport':
                                toolbar.addBtn('EXCEL导出', 'icon-excel', tool_btn);
                                break;
                            case 'excelImport':
                                toolbar.addBtn('EXCEL导入', 'icon-excel', tool_btn)
                                break;
                            case 'btns':
                                tool_btn(toolbar);
                        }
                    }
                    //初始化工具
                    initToolbarBtnGroup = function () {
                        if (hasBtn) {
                            $toolbarContaier.append($toolBtnGroupDiv);
                        }
                    }
                }
                ///////////////////////////////////////
                var initInputGroup = null;
                if (toolbars.hasOwnProperty('toolInputGroup')) {
                    var toolinputgroup = toolbars.toolInputGroup;
                    var inputGroup = [];
                    var fieldGroup = [];
                    var btns = [];
                    var inputGroupBtn = {
                        addBtn: function (text, icon, callback) {
                            var inputGroupBtnId = 'input-group-btn-id-' + JSTool.guid();
                            var btnele = JSTool.format(searchBtnTmp, inputGroupBtnId, icon, text);
                            CtrlCls.searchBtnTag += '&nbsp;&nbsp;' + btnele;
                            btns.push({id: inputGroupBtnId, event: callback});
}
                    };
                    //添加默认清空按钮
                    inputGroupBtn.addBtn('查询', 'icon-search', searchGrid);
                    inputGroupBtn.addBtn('清空', 'icon-arrow_rotate_anticlockwise', clearAllInput);
                    for (var field in toolinputgroup) {
                        if (field === 'btns') {
                            //添加其他按钮
                            toolinputgroup[field](inputGroupBtn);
                        } else {
                            inputGroup.push(toolinputgroup[field]);
                            fieldGroup.push(field);
                        }
                    }
                    var len = inputGroup.length;
                    //每行4个查询条件
                    var inputCount = _toolbars.inputCount || 4;
                    var winWidth = $(window).width();
                    if (winWidth < 600) {
                        inputCount = 1;
                    } else if (winWidth < 800) {
                        inputCount = 2;
                    } else if (winWidth < 1000) {
                        inputCount = 3;
                    }
                    var rowspan = Math.ceil(len / inputCount);
                    var trs = '';
                    for (var i = 1; i <= rowspan; i++) {
                        var tr = '<tr>';
                        var tds = '';
                        var start = ((i - 1) * inputCount);
                        var end = (i * inputCount);
                        end = end >= len ? len : end;
                        for (var j = start; j < end; j++) {
                            var td = '<td>';
                            var source = inputGroup[j];
                            var target = extend(source);
                            var field = fieldGroup[j];
                            td += getCtrlHtml(field, target);
                            td += '</td>';
                            var fieldtd = '<td style="text-align: right;"><label>' + target.label + '</label>&nbsp;&nbsp;</td>';
                            fieldtd += td;
                            tds += fieldtd;
                        }
                        if (i === 1) {
                            tds += '<td rowspan=' + rowspan + ' id="grid-input-group-btns"></td>';
                        }
                        tr += tds;
                        tr += '</tr>';
                        trs += tr;
                    }
                    $toolInputGroupDiv.find('tbody').append(trs);
                    // 初始化 查询栏
                    initInputGroup = function () {
                        //初始化按钮
                        initInputGroupBtns();
                        for (var field in toolinputgroup) {
                            var fdesc = toolinputgroup[field];
                            initCtrl(field, fdesc);
                        }
                        $toolbarContaier.append($toolInputGroupDiv);
                    };

                    function initInputGroupBtns() {
                        var $btnGroup = $toolInputGroupDiv.find('#grid-input-group-btns');
                        $btnGroup.append(CtrlCls.searchBtnTag);
                        if (btns.length > 0) {
                            for (var i = 0; i < btns.length; i++) {
                                var btn = btns[i];
                                var $lbtn = $toolInputGroupDiv.find('#' + btn.id);
                                //生成按钮
                                $lbtn.linkbutton({plain:gridOption.buttonSearchPlain});
                                $lbtn.on('click', btn.event);
                            }
                        }
                    }

                    function searchGrid() {
                        var params = CurrentGrid.getQueryParams();
                        CurrentGrid.query(params);
                    }
                    //清空输入框内容
                    function clearAllInput() {
                        for (var field in toolinputgroup) {
                            if (field == 'btns') {
                                continue;
                            }
                            var desc = toolinputgroup[field];
                            var ctrl = CtrlCls[desc.type].split('-')[1];
                            if (desc.between) {
                                var f2 = field.split(',');
                                for (var x in f2) {
                                    var fx = f2[x];
                                    $('[name="' + fx + '"]').parent('span').siblings('input')[ctrl]('setValue', null);
                                }
                            }else{
                                $('[name="' + field + '"]').parent('span').siblings('input')[ctrl]('setValue', null);
                            }
                        }
                    }
                    // 生成查询参数
                    this.getQueryParams=function () {
                        var queryParams='',val,val0,val1,fields,fobj;
                        for(var field in toolinputgroup){
                            fobj=extend(toolinputgroup[field]);
                            if(fobj.between){
                                fields=field.split(',');
                                val0=findVal(fields[0]);
                                val1=findVal(fields[1]);
                                if(!JSTool.isEmpty(val0,val1)){
                                    queryParams+=getKeyVal(fields[0],val0);
                                    queryParams+=getKeyVal(fields[1],val1);
                                }
                            }else{
                                val=findVal(field);
                                if(!JSTool.isEmpty(val)){
                                    queryParams+=getKeyVal(field,val);
                                }
                            }
                        }
                        function getKeyVal(key,val) {
                            return JSTool.format('"{0}":"{1}",',key,fobj.mhcx?mhcx(val):val);
                        }
                        function findVal(field) {
                            return $.trim(findField(field).val());
                        }

                        //模糊查询
                        function mhcx(val) {
                            return ('%'+val+'%');
                        }
                        //返回参数值
                        if(!JSTool.isEmpty(queryParams)){
                          return $.parseJSON(JSTool.format('{{0}}',queryParams.substring(0,queryParams.length-1)));
                        }else{
                            return {};
                        }
                    }
                }
                function initCtrl(field, fdesc){
                    if(fdesc.between){
                        var fields=field.split(',');
                        bindCtrl(findField(fields[0]),fdesc);
                        bindCtrl(findField(fields[1]),fdesc);
                    }else{
                        bindCtrl(findField(field),fdesc);
                    }
                }
                function findField(field) {
                    return $toolInputGroupDiv.find('[name="'+field+'"]');
                }
                this.init=function () {
                    if(initInputGroup){
                        initInputGroup();
                    }
                    if(initToolbarBtnGroup){
                        initToolbarBtnGroup();
                    }
                }
            }
            //*/*/////

            //grid查询控件(已过时)使用toolbars替代
            function QueryControl(controlContainer, queryControlObj) {
                var $controlContainer = $(controlContainer);

                function findField(field) {
                    return $controlContainer.find(JSTool.format('[name={0}]', field));
                }

                //获取输入框对象
                this.getCtrl = function (ctrlName) {
                    return findField(ctrlName);
                }

                //绑定搜索框数据
                function initCtrl(field, fdesc) {
                    if (fdesc.between) {
                        var fields = field.splice(',');
                        bindCtrl(findField(fields[0]), fdesc);
                        bindCtrl(findField(fields[1]), fdesc);
                    } else {
                        bindCtrl(findField(field), fdesc);
                    }
                }

                var btnGroup = {
                    addBtn: function (text, icon, callback) {
                        var inputGroupBtnId = 'input-group-btn-id-' + JSTool.guid();
                        var btntag = JSTool.format(searchBtnTmp, inputGroupBtnId, text, icon);
                        //ToD
                    }
                }
                //初始化搜索框内容
                this.initControls = function () {
                    for (var field in queryControlObj) {
                        var source = queryControlObj[field];
                        if (field == 'btns') {
                            //TOD
                        } else {
                            var target = extend(source);
                            var field = '<lable>' + target.label + '</lable>';
                            var ctrl = getCtrlHtml(field, target) + JSTool.space();
                            $controlContainer.append(field + ctrl);
                            //绑定数据
                            initCtrl(field, target);
                        }
                    }
                    //添加搜索按钮
                    $controlContainer.append(CtrlCls.searchBtnTag);
                    $controlContainer.find('.grid-search-btn').linkbutton();
                    $controlContainer.find('.grid-allsearch-btn').linkbutton();
                    return this;
                };
                //监听事件
                this.searchClick = function (fn) {
                    $controlContainer.find('.grid-search-btn').on('click', fn);
                    return this;
                };
                this.allsearchClick = function (fn) {
                    $controlContainer.find('.grid-allsearch-btn').on('click', fn);
                    return this;
                }
                //生产查询参数
                this.getQueryParams = function () {
                    var queryParams = '', val, val0, val1, fields, fobj;
                    for (var field in queryControlObj) {
                        fobj = extend(queryControlObj[field]);
                        if (fobj.between) {
                            fields = field.split(',');
                            val0 = findVal(fields[0]);
                            val1 = findVal(fields[1]);
                            if (!JSTool.isEmpty(val0, val1)) {
                                queryParams += getKeyValue(fields[0], val0);
                                queryParams += getKeyValue(fields[1], val1);
                            }
                        } else {
                            val = findVal(field);
                            if (!JSTool.isEmpty(val)) {
                                queryParams += getKeyValue(field, val);
                            }
                        }
                    }

                    function getKeyValue(key, val) {
                        return JSTool.format('"{0}":"{1}",', key, fobj.mhcx ? mhcx(val) : val);
                    }

                    function findVal(field) {
                        return $.trim(findField(field).val());
                    }

                    function mhcx(val) {
                        return ('%' + val + '%');
                    }

                    if (!JSTool.isEmpty(queryParams)) {
                        return $.parseJSON(JSTool.format('{{0}}', queryParams.substring(0, queryParams.length - 1)));
                    } else {
                        return {};
                    }
                }
            }

            /**
             * 右击菜单生成
             */
            this.setContextMenu=function (inopts) {
                var cxtMenuDivId='grid-cxt-menu-'+JSTool.guid();
                var $cxtMenuDiv=$('<div  id="'+cxtMenuDivId+'" class="easyui-menu" style="width:120px; display: none" ></div>');
                function getMenuNode(option,isfather) {
                    var div='<div iconCls="{0}">{1}</div>';
                    if(isfather){
                        return JSTool.format(div,option.icon,'<span>'+option.text+'</span>');
                    }else {
                        return JSTool.format(div,option.icon,option.text);
                    }
                }
                var currentRow , currentIndex;
                function resolveOptions($fatherdiv,opts) {
                    for(var x in opts){
                        var opt=opts[x];
                        if(JSTool.isEmpty(opt)){
                            $fatherdiv.append('<div class="menu-sep"></div>');
                        }else if(opt.hasOwnProperty('children')){
                            var $node=$(getMenuNode(opt,true));
                            var $div=$('<div></div>');
                            resolveOptions($div,opt.children);
                            $node.append($div);
                            $fatherdiv.append($node);
                        }else{
                            var $node=$(getMenuNode(opt,false));
                            if(opt.hasOwnProperty('onClick')){
                                $node.on('click',{row:function () {
                                        return currentRow;
                                    },index:function () {
                                        return currentIndex;
                                    }},opt.onClick);
                            }
                            $fatherdiv.append($node);
                        }
                    }
                }
                resolveOptions($cxtMenuDiv,inopts);
                $(document.body).append($cxtMenuDiv);
                $cxtMenuDiv.menu();
                this.options.onRowContextMenu=function (e, rowIndex, rowData) {
                    $('#'+cxtMenuDivId).menu('show',{left:e.pageX,top:e.pageY});
                    currentIndex=rowIndex;
                    currentRow=rowData;
                    e.preventDefault();
                }
                return this;
            }
        }

        //
        var _Grid = function (selector, gridOption) {
            var $grid = $(selector);
            var _options = gridOption.getOptions();
            var toolopts = _options.toolbar;
            if(gridOption.ntd){
                var grid=this;
                var toolbars=gridOption.getToolbars();
                _options.toolbar=toolbars.containerSelector;
                toolbars.init();
                this.getQueryParams=function () {
                    var options=gridOption.getOptions();
                    var queryParams=options['queryParams'];
                    if(queryParams && queryParams.hasOwnProperty('params')){
                        //默认的筛选参数
                        var p=queryParams.params;
                        //输入框的参数
                        var p1=toolbars.getQueryParams();
                        for(var field in p){
                            p1[field]=p[field];
                        }
                        return {params:p1};
                    }else{
                        return {params:toolbars.getQueryParams()};
                    }
                };
                this.search=function (params) {
                    var target=toolbars.getQueryParams();
                    grid.query({
                        params:$.extend({},target,params.params),
                    });
                    return this;
                }
            }else if(gridOption.ntqc){
                if(gridOption.getQueryControl()){
                    var grid=this,queryControl=gridOption.getQueryControl()
                        .initControls()
                        .searchClick(function () {
                            var options=gridOption.getOptions();
                            var params=options['queryParams'] || new Object();
                            if(params.hasOwnProperty('params')){
                                JSTool.extend(params.params,queryControl.getQueryParams());
                            }else{
                                params.params=queryControl.getQueryParams();
                            }
                            grid.query(params);
                    });
                    this.getQueryParams=function () {
                        return queryControl.getQueryParams();
                    }
                    this.search=function (params) {
                        var target=queryControl.getQueryParams();
                        this.query({
                            params:JSTool.extend(target,params),
                        });
                        return this;
                    }
                    this.getCtrl=function (name) {
                        return queryControl.getCtrl(name);
                    }
                }
            }
            if(toolopts==null && gridOption.toolbarbtnsArr.length>0){
                _options.toolbar=gridOption.toolbarbtnsArr;
            }
            var isTigger=false;
            if(JSTool.isFunction(_options.onLoadSuccess)) {
                var loadSucc = _options.onLoadSuccess;
                _options.onLoadSuccess = function () {
                    //删除默认按钮事件
                    $grid.parent('.datagrid-view').prev('.datagrid-toolbar')
                        .find('a').removeClass('l-btn-plain');
                    //数据表数据加载完毕后执行的函数
                    loadSucc.apply($grid, arguments);
                    //表格数据标题字体大小和样式
                    $('.datagrid-header .datagrid-header-row td>div>span').css({
                        fontSize: '14px', fontWeight: 'bold'
                    });
                    isTigger = true;
                }
            }else {
                _options.onLoadSuccess = function () {
                    //删除默认按钮事件
                    $grid.parent('.datagrid-view').prev('.datagrid-toolbar')
                        .find('a').removeClass('l-btn-plain');
                    isTigger = true;
                    //表格数据标题字体大小和样式
                    $('.datagrid-header .datagrid-header-row td>div>span').css({
                        fontSize: '14px', fontWeight: 'bold'
                    });
                }
            }
            if(!isTigger){
                window.setTimeout(function () {
                    $grid.parent('.datagrid-view').prev('.datagrid-toolbar')
                        .find('a').removeClass('l-btn-plain');
                    $('.datagrid-header .datagrid-header-row td>div>span').css({
                        fontSize: '14px',fontWeight: 'bold'
                    });
                },5)
            }

            this.loadData=function (data) {
                $grid.datagrid('loadData',data);
                return this;
            }
            this.getData=function () {
                return $grid.datagrid('getData');
            }
            this.getRows=function () {
                return this.getData().rows;
            }
            this.reload=function () {
                $grid.datagrid('reload');
                return this;
            }
            this.getSelections = function () {
                return $grid.datagrid('getSelections');
            }
            this.getSelected=function (callback) {
                var selected=this.getSelections();
                if(selected.length>0){
                    callback.apply(this,selected);
                }else {
                    Msg.warning(Msg.UNSELECTED);
                }
            }
            this.getSelectedFieldValues=function (field) {
                var objs=this.getSelections();
                var fieldValues=new Array();
                for(var key in objs){
                    fieldValues.push(objs[key][field])
                }
                return fieldValues;
            }
            this.getAllGuids=function () {
                var rows=this.getRows(),guidArr=[];
                if(rows.length>0){
                    for(var key in rows){
                        var row=rows[key];
                        guidArr.push(gridOption.primaryKey);
                    }
                    return guidArr.join('|').toString();
                }
                return null;
            }
            this.getSelectedGuidsStr = function () {
                return this.getSelectedFieldsStr(gridOption.primaryKey)
            }
            this.getSelectedFieldsStr = function (field) {
                var objs = this.getSelections();
                if(objs.length>0){
                    var fields=[];
                    for (var key in objs) {
                        fields.push(objs[key][field]);
                    }
                    return fields.join('|').toString();
                }
                return null;
            }
            var loadUrl=_options.url;
            if(gridOption.loadNow===false){
                delete _options.url;
            }
            //初始化数据表格
            $grid.datagrid(_options);
            this.query=function (params) {
                if(gridOption.loadNow===false){
                    $grid.datagrid('options').url=loadUrl;
                }
                //查询数据
                $grid.datagrid('load',params);
                return this;
            }
            this.insertRow=function (jsonObject) {
                $grid.datagrid('insertRow',jsonObject);
                return this;
            }
            this.deleteRow=function (rowIndex) {
                $grid.datagrid('deleteRow',rowIndex);
                return this;
            }
            this.getRowIndex=function (row) {
                $grid.datagrid('getRowIndex',row);
                return this;
            }
        }
        return {
            setUrl:function(url){
                gridOption.options.url=url;
                return this;
            },
            showCkBox:function(flag){
                gridOption.showCkBox=flag;
                return this;
            },
            setMethod:function(){
                gridOption.options.method=method;
                return this;
            },
            setCols:function(cols){
              gridOption.setCols(cols);
              return this;
            },
            setPrimaryKey:function(pk){
                gridOption.primaryKey=pk;
                return this;
            },
            setOptions:function(options){
                JSTool.extend(gridOption.options,options);
                return this;
            },
            setRowStyler:function(fn){
                gridOption.options.rowStyler=fn;
                return this;
            },
            setQueryControl:function(){
                gridOption.setQueryControl.apply(gridOption,arguments);
                return this;
            },
            toolBtn:function(){
                gridOption.toolBtn.apply(gridOption,arguments);
                return this;
            },
            toolAdd:function(handler){
                gridOption.toolBtn('新增','icon-add',handler);
                return this;
            },
            toolEdit:function(handler){
                gridOption.toolBtn('编辑','icon-edit',handler);
                return this;
            },
            toolRemove:function(arg){
                gridOption.toolRemove(arg);
                return this;
            },
            toolPrint:function(fun){
                gridOption.toolBtn('打印','icon-print',fun);
                return this;
            },
            loadSuccess:function(fn){
                gridOption.options.onLoadSuccess=fn;
                return this;
            },
            toolbars:function(obj){
                gridOption.setToolbars(obj);
                return this;
            },
            loadNow:function(flag){
                gridOption.loadNow=flag;
                return this;
            },
            buttonToolPlain:function(flag){
                gridOption.buttonToolPlain=flag
                return this;
            },
            buttonSearchPlain:function(flag){
                gridOption.buttonSearchPlain=flag
                return this;
            },
            setContextMenu:function(opts){
                gridOption.setContextMenu(opts);
                return this;
            },
            init: function () {
                return (CurrentGrid = new _Grid(selector || '#data-grid', gridOption));
            }
        };
    };
    //封装错误信息
    window.Msg = (function () {
        var _msg = new Object();
        _msg.ERRORPROMPT = '错误提示';
        _msg.MSGPROMPT = '消息提示';
        _msg.WARNPROMPT = '警告提示';
        _msg.UNERROR = '未知错误，操作失败';
        _msg.QUESTIONPROMPT = '是否执行此操作？';
        _msg.LOGOUTPROMPT = '是否注销当前登录？';
        _msg.UNSELECTED = '未选择操作数据';
        _msg.AJAXERROR = "异步请请求出错，状态：{0}，错误信息：{1}";
        _msg.LOADINGTEXT = '正在处理，请稍等。。。';
        _msg.UNAUTH = '未授权登陆';
        _msg.NOTCOMPLETE = '输入信息不全';
        _msg.EXISTXCHILDREN = '存在子集';
        _msg.error = function (text) {
            $.messager.alert(Msg.ERRORPROMPT, text, 'error');
        }
        _msg.info = function (text, fn) {
            $.messager.alert(Msg.MSGPROMPT, text, 'info', fn);
        }
        _msg.warning = function (text, fn) {
            $.messager.alert(Msg.WARNPROMPT, (text || Msg.UNERROR), 'warning', fn);
        }
        _msg.loading = function (loadingtext) {
            $.blockUI({message: '<h6><img src="/easyui/themes/default/images/loading.gif" >' + (loadingtext || _msg.LOADINGTEXT) + '</h6>'});
        }
        _msg.loadingClose = function () {
            $.unblockUI();
        }

        function succ1(text, time, fun) {
            $.messager.show({
                title: Msg.MSGPROMPT,
                msg: text,
                showType: 'fade',
                time: time,
                style: {
                    right: '',
                    bottom: ''
                }
            });
            if (fun) setTimeout(fun, time);
        }

        function succ2(text, fun) {
            succ1(text, 1000, fun);
        }

        function succ3(text) {
            succ2(text, null);
        }

        //信息提示窗
        function confirm_MSG(text, fun) {
            $.messager.confirm(Msg.MSGPROMPT, text, fun)
        }

        //询问提示窗
        function confirm_QUE(fun) {
            confirm_MSG(Msg.QUESTIONPROMPT, fun);
        }

        JSTool.addMethod(_msg, "success", succ1)
        JSTool.addMethod(_msg, "success", succ2)
        JSTool.addMethod(_msg, "success", succ3)

        JSTool.addMethod(_msg, "confirm", confirm_MSG)
        JSTool.addMethod(_msg, 'confirm', confirm_QUE)
        return _msg;
    })();
// 封装异步请求 增加权限拦截
    window.Http = (function () {
        var POST = 'POST', GET = 'GET';

        function ajax(url, data, callback, method) {
            Msg.loading();
            $.ajax({
                type: method,
                url: url,
                data: data,
                beforeSend: function () {

                },
                success: function (res) {
                    Msg.loadingClose();
                    if (JSTool.isString(res)) {
                        var res = $.parseJSON(res);
                        if (res.auth) {
                            if (callback) {
                                callback(res);
                            } else {
                                if (res.error) {
                                    Msg.error(res.msg);
                                } else {
                                    if (res.succ) {
                                        Msg.success(res.msg);
                                    } else {
                                        Msg.warning();
                                    }
                                }
                            }
                        } else {
                            Msg.error(Msg.UNAUTH);
                        }
                    }
                },
                error: function (err) {
                    Msg.loadingClose();
                    console.log(err);
                    Msg.error(JSTool.format(Msg.AJAXERROR, err.status, err.responseText))
                }
            });
        }

        function get_1(url) {
            ajax(url, {}, null, GET);
        }

        function get_2(url, fun) {
            ajax(url, {}, fun, GET);
        }

        function post_2(url, data) {
            ajax(url, data, null, POST);
        }

        function post_3(url, data, fun) {
            ajax(url, data, fun, POST);
        }

        var _http = new Object();
        JSTool.addMethod(_http, 'get', get_1);
        JSTool.addMethod(_http, 'get', get_2)
        JSTool.addMethod(_http, 'post', post_2)
        JSTool.addMethod(_http, 'post', post_3)
        return _http;
    })();
    window.Dialog=function (selector) {
        var $selector=$(selector),optObj=new getOption();
        function getOption() {
            var dialogOptions={
                title: '',
                width: null,
                height: null,
                closed: true,
                cache: false,
                collapsible:false,
                resizable:false,
                href: '',
                modal: true
            };
            //输入框样式参数
            function extend(source) {
                var fd = {
                    type: 'text',
                    label: undefined,
                    val: '',
                    between: false,
                    style: undefined,
                    options: undefined,
                };
                for(var key in source){
                    if(fd.hasOwnProperty(key)){
                        fd[key]=source[key];
                    }
                }
                return fd;
            }
            var divStr='<div style="text-align: center;padding: 35px 10px 0px 10px"><form id="{0}" method="{1}"><table style="margin: auto" cellspacing="0" cellpadding="5" border="0"><tbody></tbody></table></form></div>';
            var tool_linkbtn_tag = '<a id="{2}" href="javascript:void(0);" class="easyui-linkbutton {3}" data-options="iconCls:\'{0}\'">{1}</a>';
            var CtrlCls = {
                inputTag: '<input class="{0}" name="{1}" id="{2}" style="{3}" value="{4}" title="{5}"/>',
                searchBtnTag: '',
                date: 'easyui-datebox',
                text: 'easyui-textbox',
                select: 'easyui-combobox',
                number: 'easyui-numberbox',
                numberspinner: 'easyui-numberspinner',
                datetimespinner: 'easyui-datetimespinner',
                datetime: 'easyui-datetimebox',
                combotree: 'easyui-combotree'
            };
            function tableInput(selector,tableInputOption) {
                //添加输入框
                var $selector=$(selector);
                if(tableInputOption.hasOwnProperty('form')){
                    var form=tableInputOption.form;
                    var formStr=JSTool.format(divStr,form.id,form.method);
                    $selector.append(formStr);
                }else{
                    var formStr=JSTool.format(divStr,'editForm','post');
                    $selector.append(formStr);
                }
                if(tableInputOption.hasOwnProperty('inputGroup')){
                    var inputGroup=tableInputOption.inputGroup;
                    var tr='';
                    for(var field in inputGroup){
                        var target=extend(inputGroup[field]);
                        var inputStr=getCtrlHtml(field,target);
                        tr+='<tr>';
                        var td='<td style="text-align: right">'+target.label+'</td>';
                        td+='<td>'+inputStr+'</td>';
                        tr+=td+'</tr>';
                    }
                    $selector.find('tbody').append(tr);
                }
                //添加按钮
                if(tableInputOption.hasOwnProperty('btnGroup')){
                    var btnGroup=tableInputOption.btnGroup;
                    for(var field in btnGroup){


                    }
                }else{
                    var submitStr=JSTool.format(tool_linkbtn_tag,'icon-submit','提交','submit'+JSTool.guid(),'form-submit');
                    var resetStr=JSTool.format(tool_linkbtn_tag,'icon-reset','重置','reset'+JSTool.guid(),'form-reset');
                    var buttonStr='<tr style="text-align: center"><td colspan="2">'+submitStr+JSTool.space(6)+resetStr+'</td></tr>';
                    $selector.find('tbody').append(buttonStr);
                    $(submitStr).linkbutton();
                    $(resetStr).linkbutton();
                }
                return $selector;
            };
            function setTableInput(tableInputOption) {
                return tableInput(selector,tableInputOption);
            }
            function getCtrlHtml(field, fdesc) {
                var domStr = "", ctrlCls = CtrlCls[fdesc.type], styleStr = getStyleStr(fdesc.style);
                if (fdesc.between) {
                    var fields = field.splice(',');
                    domStr += getInput(fields[0]);
                    domStr += '-';
                    domStr += getInput(fields[1]);
                } else {
                    domStr = getInput(field);
                }

                function getInput(field) {
                    return JSTool.format(CtrlCls.inputTag, ctrlCls, field, field + '-input-group',
                        styleStr, '', '');
                }

                return domStr;
            }
            function bindCtrl($dom, fdesc) {
                if ($dom.length > 0) {
                    var options = fdesc.options;
                    switch (fdesc.type) {
                        case 'text':
                            $dom.textbox(options);
                            break;
                        case 'date':
                            $dom.datebox(options);
                            break;
                        case 'select':
                            if (JSTool.isArray(fdesc.val)) {
                                options.data = fdesc.val;
                            }
                            $dom.combobox(options);
                            break;
                        case 'number':
                            $dom.numberbox(options);
                            break;
                        case 'numberspinner':
                            $dom.numberspinner(options);
                            break;
                        case 'datetimespinner':
                            $dom.datetimespinner(options);
                            break;
                        case 'datetime':
                            $dom.datebox(options);
                            break;
                        case 'combotree':
                            $dom.combotree(options);
                            break;
                        default:
                    }
                }
            }
            var getStyleStr = function (style) {
                var styleStr = '';
                if (style) {
                    if (!style.hasOwnProperty('width')) {
                        style.width = '300px';
                    }
                    for (var key in style) {
                        var val = style[key];
                        styleStr += key + ':' + val + ';';
                    }
                } else {
                    styleStr = 'width:300px';
                }
                return styleStr;
            };
            this.init=function (tableInputOption) {
                var $selector=setTableInput(tableInputOption);
                var inputGroup=tableInputOption.inputGroup;
                for(var field in inputGroup){
                    var fdesc=inputGroup[field];
                    var $dom=$selector.find('[name="'+field+'"]');
                    bindCtrl($dom,fdesc);
                }
            }
            this.resolveOptions=function(options){
                for(var key in options){
                    if(key==='opt'){
                        var opt=options[key]
                        for(var optKey in opt){
                            if(dialogOptions.hasOwnProperty(optKey)){
                                dialogOptions[optKey]=opt[optKey]
                            }
                        }
                    }else if(key==='toolbar'){
                        var toolbar=options[key];
                        var objArray=[];
                        for(var toolKey in toolbar){
                            objArray.push({
                                text:toolbar[toolKey].text,
                                iconCls:toolbar[toolKey].iconCls,
                                handler:toolbar[toolKey].handler
                            })
                        }
                        dialogOptions.toolbar=objArray;
                    }else if(key==='buttons'){
                        var buttons=options[key];
                        var objArray=[];
                        for(var toolKey in buttons){
                            objArray.push({
                                text:buttons[toolKey].text,
                                handler:buttons[toolKey].handler
                            })
                        }
                        dialogOptions.buttons=objArray;
                    }
                }
            };
            this.getOptions=function () {
                return dialogOptions;
            };
            this.destroy=function () {
                $selector.dialog('destroy');
            }
        };
        return{
            tableInput:function(obj){
                optObj.init(obj);
                return this;
            },
            close:function(){
                $selector.dialog('close');
                return this;
            },
            destroy:function(){
                optObj.destroy();
                return this;
            },
            onClose:function(){
                $selector.dialog({
                    onClose:function () {

                    }
                });
            },
            open:function(){
                $selector.dialog('open');
                return this;
            },
            setDialogOptions:function(options){
                optObj.resolveOptions(options);
                return this;
            },
            init:function () {
                $selector.dialog(optObj.getOptions());
                return this;
            }
        };
    }
})(window,jQuery);




package com.example.controller;

import com.example.base.MyLog;
import com.example.pojo.sysUsers.User;
import com.example.service.ILoginService;
import com.example.service.impl.ILoginserviceImpl;
import com.example.utils.LogUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/7 11:23
 */
@Controller
public class LoginController {

    @Resource
    private ILoginService iLoginService;
    @RequestMapping(value = "/login",method= RequestMethod.GET)
    @MyLog(method = "用户登录方法",module = "用户登录模块")
    public Object login(String name,String password){
        Logger log = LogUtils.getExceptionLogger();
        Logger log1 = LogUtils.getBussinessLogger();
        Logger log2 = LogUtils.getDBLogger();
        Subject subject= SecurityUtils.getSubject();
        UsernamePasswordToken token=new UsernamePasswordToken(name,password);
        subject.login(token);
        log.error("getExceptionLogger===日志测试");
        log1.info("getBussinessLogger===日志测试");
        log2.debug("getDBLogger===日志测试");

        return "test/bindjs";
    }
}

package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/3/30 17:31
 */
@Controller
public class HelloController {
    @RequestMapping("/index")
    @ResponseBody
    public String index(){
        return "Hello Spring Boot!";
    }
    @RequestMapping("/login")
    public String login(){
        return "login/login";
    }
}

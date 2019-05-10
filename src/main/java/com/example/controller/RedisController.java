package com.example.controller;

import com.example.pojo.sysUsers.RedisModel;
import com.example.service.IRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/13 10:47
 */
@RestController
public class RedisController {
    @Autowired
    private IRedisService iRedisService;
    @RequestMapping("/add")
    @ResponseBody
    public String add(){
        System.out.println("start......");
        RedisModel model1=new RedisModel();
        model1.setName("张三");
        model1.setPhone("13796964512");
        model1.setAddress("铁路医院");
        model1.setRedisKey("zhangsan");
        iRedisService.put(model1.getRedisKey(),model1,-1);
        RedisModel model2=new RedisModel();
        model2.setName("李四");
        model2.setPhone("13796964512");
        model2.setAddress("铁路医院");
        model2.setRedisKey("lisi");
        iRedisService.put(model2.getRedisKey(),model2,-1);
        RedisModel model3=new RedisModel();
        model3.setName("王五");
        model3.setPhone("13796964512");
        model3.setAddress("铁路医院");
        model3.setRedisKey("wangwu");
        iRedisService.put(model3.getRedisKey(),model3,-1);
        System.out.println("end......");
        return "add OK!";
    }
    @RequestMapping("/getAll")
    @ResponseBody
    public Object getAll(){
        return iRedisService.getAll();
    }
}

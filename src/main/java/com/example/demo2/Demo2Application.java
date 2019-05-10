package com.example.demo2;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@SpringBootApplication
@ComponentScan(basePackages={"com.example.controller","com.example.pojo.sysUsers",
        "com.example.redis","com.example.service","com.example.service.impl","com.example.shiro","com.example.base"})
@MapperScan(basePackages={"com.example.dao.sysUsers"})
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 36000)
public class Demo2Application {

    public static void main(String[] args) {
        SpringApplication.run(Demo2Application.class, args);
    }

}

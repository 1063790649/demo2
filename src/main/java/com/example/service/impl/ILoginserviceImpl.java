package com.example.service.impl;

import com.example.dao.sysUsers.UserMapper;
import com.example.pojo.sysUsers.User;
import com.example.service.ILoginService;
import com.example.service.IRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/6 11:32
 */
@Service
public class ILoginserviceImpl implements ILoginService {

    @Resource
    private UserMapper userMapper;

    @Override
    public User findName(String name) {
        User user=userMapper.selectByName(name);
        return user;
    }
}

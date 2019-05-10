package com.example.service;

import com.example.pojo.sysUsers.User;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/6 11:31
 */
public interface ILoginService {
    User findName(String name);
}

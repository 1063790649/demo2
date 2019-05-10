package com.example.dao.sysUsers;

import com.example.base.BaseDao;
import com.example.pojo.sysUsers.User;

public interface UserMapper extends BaseDao<User> {
    User selectByName(String name);
}
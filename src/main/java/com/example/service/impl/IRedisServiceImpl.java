package com.example.service.impl;

import com.example.pojo.sysUsers.RedisModel;
import com.example.service.IRedisService;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/13 10:49
 */
@Component("iRedisService")
public class IRedisServiceImpl<T> extends IRedisService<T> {
    private static final String REDIS_KEY="TEST_REDIS_KEY";

    @Override
    protected String getRedisKey() {
        return this.REDIS_KEY;
    }
}

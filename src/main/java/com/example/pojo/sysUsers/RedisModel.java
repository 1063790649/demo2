package com.example.pojo.sysUsers;

import com.example.base.BasePojo;
import lombok.Data;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/13 10:42
 */
@Data
public class RedisModel implements BasePojo {
    private String redisKey;
    private String name;
    private String phone;
    private String address;
}

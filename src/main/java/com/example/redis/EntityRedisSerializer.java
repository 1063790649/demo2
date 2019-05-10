package com.example.redis;

import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/13 18:13
 */
public class EntityRedisSerializer implements RedisSerializer<Object> {

    @Override
    public byte[] serialize(Object o) throws SerializationException {
        if(o==null){
            return new byte[0];
        }
        return SerializeUtil.serialize(o);
    }

    @Override
    public Object deserialize(byte[] bytes) throws SerializationException {
        if(bytes==null && bytes.length==0){
          return null;
        }
        return SerializeUtil.unSerialize(bytes);
    }
}

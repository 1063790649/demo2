package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/7 10:38
 */
public abstract class IRedisService<T> {
    @Autowired
    protected RedisTemplate<String,Object> redisTemplate;
    @Resource
    protected HashOperations<String,String,T> hashOperations;
    protected abstract String getRedisKey();
    public void put(String key,T doamin,long expire){
        hashOperations.put(getRedisKey(),key,doamin);
        if(expire!=-1){
            redisTemplate.expire(getRedisKey(),expire, TimeUnit.SECONDS);
        }
    }
    public void removed(String key){
        hashOperations.delete(getRedisKey(),key);
    }
    public T get(String key){
        return hashOperations.get(getRedisKey(),key);
    }
    public List<T> getAll(){
        return hashOperations.values(getRedisKey());
    }
    public Set<String> getKeys(){
        return hashOperations.keys(getRedisKey());
    }
    public boolean isKeyExists(String key) {
        return hashOperations.hasKey(getRedisKey(), key);
    }
    public long count(){
        return hashOperations.size(getRedisKey());
    }
    public void empty(){
        Set<String> set=hashOperations.keys(getRedisKey());
        set.stream().forEach(key->hashOperations.delete(getRedisKey(),key));
    }
}

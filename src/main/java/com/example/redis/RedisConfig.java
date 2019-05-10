package com.example.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.*;
import org.springframework.data.redis.serializer.StringRedisSerializer;



/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/7 10:08
 */
@Configuration
public class RedisConfig {
    @Autowired
    private RedisConnectionFactory redisConnectionFactory;
    @Bean
    public RedisTemplate<String,Object> functionDomainRedisTemplate(){
        RedisTemplate<String,Object> redisTemplate=new RedisTemplate<>();
        initDomainRedisTemplate(redisTemplate,redisConnectionFactory);
        return redisTemplate;
    }
    private void initDomainRedisTemplate(RedisTemplate<String,Object> redisTemplate,RedisConnectionFactory redisConnectionFactory){
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new EntityRedisSerializer());
        redisTemplate.setValueSerializer(new EntityRedisSerializer());
        redisTemplate.setConnectionFactory(redisConnectionFactory);
    }
    @Bean
    public HashOperations<String,String,Object> hashOperations(RedisTemplate<String,Object> redisTemplate){
        return redisTemplate.opsForHash();
    }
    @Bean
    public ValueOperations<String,Object> valueOperations(RedisTemplate<String,Object> redisTemplate){
        return redisTemplate.opsForValue();
    }
    @Bean
    public ListOperations<String,Object> listOperations(RedisTemplate<String,Object> redisTemplate){
        return redisTemplate.opsForList();
    }
    @Bean
    public SetOperations<String,Object> setOperations(RedisTemplate<String,Object> redisTemplate){
        return redisTemplate.opsForSet();
    }
    @Bean
    public ZSetOperations<String,Object>zSetOperations(RedisTemplate<String,Object> redisTemplate){
        return redisTemplate.opsForZSet();
    }
}

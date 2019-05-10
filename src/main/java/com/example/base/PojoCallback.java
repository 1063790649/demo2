package com.example.base;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/7 9:19
 */
@FunctionalInterface
public interface PojoCallback {
    Object callback(Object...params);
}

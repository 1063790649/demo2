package com.example.base;

import java.lang.annotation.*;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/14 15:19
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ControllerLog {
    public String methodDesc() default "";
}

package com.example.base;


import java.lang.annotation.*;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/7 9:23
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExcelInterface {
    String value() default "";
    int col() default 0;
}

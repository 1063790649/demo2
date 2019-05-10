package com.example.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/20 12:07
 */
public class LogUtils {
    public static Logger getBussinessLogger(){
        return LoggerFactory.getLogger(LogEnum.BUSSINESS.getCategory());
    }
    public static Logger getPlatformLogger(){
        return LoggerFactory.getLogger(LogEnum.PLATFORM.getCategory());
    }
    public static Logger getDBLogger(){
        return LoggerFactory.getLogger(LogEnum.DB.getCategory());
    }
    public static Logger getExceptionLogger(){
        return LoggerFactory.getLogger(LogEnum.EXCEPTION.getCategory());
    }
}

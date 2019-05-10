package com.example.base;

import com.alibaba.fastjson.JSON;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/14 15:51
 */
//@Aspect
//@Configuration
public class LogAspect {
    private static final Logger logger= LoggerFactory.getLogger(LogAspect.class);

    /**
     * service层切点
     */
    @Pointcut("@annotation(com.example.base.ServiceLog)")
    public void serviceAspect(){

    }

    /**
     * controller层切点
     */
    @Pointcut("@annotation(com.example.base.ControllerLog)")
    public void controllerAspect(){

    }

    /**
     * 前置通知 用于拦截Controller层记录用户的操
     * @param joinPoint
     */
    @Before("controllerAspect()")
    public void doBefore(JoinPoint joinPoint){
        try {
            HttpServletRequest request= ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
            //请求类名
            String className=joinPoint.getTarget().getClass().getName();
            //请求方法
            String requestMethod=joinPoint.getSignature().getName()+"()";
            //方法参数
            String methodParam= JSON.toJSONString(joinPoint.getArgs());
            //方法描述
            String methodDescription=getControllerMethodDescription(joinPoint);
            StringBuffer stringBuffer=new StringBuffer(1000);
            stringBuffer.append("\n");
            stringBuffer.append("*********************************Request请求***************************************");
            stringBuffer.append("\n");
            stringBuffer.append("ClassName    :").append(className).append("\n");
            stringBuffer.append("RequestMethod:").append(requestMethod).append("\n");
            stringBuffer.append("RequestParams:").append(methodParam).append("\n");
            stringBuffer.append("RequestType  :").append(request.getMethod()).append("\n");
            stringBuffer.append("Description  :").append(methodDescription).append("\n");
            stringBuffer.append("serverAddr   :").append(request.getScheme()+"://"+request.getServerName()+
            ":"+request.getServerPort()).append("\n");

        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * 获取注解中对方法的描述信息 用于controller层注解
     * @param joinPoint
     * @return
     * @throws Exception
     */
    public static String getControllerMethodDescription(JoinPoint joinPoint) throws Exception{
        return "";
    }

    /**
     * 获取注解中对方法的描述信息 用于service层注解
     * @param joinPoint
     * @return
     * @throws Exception
     */
    public static String getServiceMethodDescription(JoinPoint joinPoint) throws Exception{
        return "";
    }
}

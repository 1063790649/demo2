package com.example.base;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/14 17:59
 */
@Component
@Aspect
public class MyLogAction {
    private static final Logger logger = LoggerFactory.getLogger(MyLogAction.class);

    @Pointcut("@annotation(com.example.base.MyLog)")
    public void executePointCut() {

    }

    @After("executePointCut()")
    public void doAfterAdvice(JoinPoint joinPoint) throws Throwable {
        Object target = joinPoint.getTarget();
        String methodName = joinPoint.getSignature().getName();
        Signature sig = joinPoint.getSignature();
        MethodSignature mis = null;
        if (!(sig instanceof MethodSignature)) {
            throw new IllegalAccessException("该注解只能用于方法");
        }
        mis = (MethodSignature) sig;
        Class[] parameterTypes = mis.getMethod().getParameterTypes();
        Method method = target.getClass().getMethod(methodName, parameterTypes);
        if (method != null) {
            MyLog log = method.getAnnotation(MyLog.class);
            if (log != null) {
                logger.info(log.method());
                logger.info(log.module());
                //System.out.println(log.method());
                //System.out.println(log.module());
            }
        }
    }
}

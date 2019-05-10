package com.example.shiro;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.SessionListener;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/7 14:34
 */
public class BDSessionListener implements SessionListener {

    private final AtomicInteger sessionCount=new AtomicInteger(0);
    @Override
    public void onStart(Session session) {
        sessionCount.incrementAndGet();
    }

    @Override
    public void onStop(Session session) {
        sessionCount.decrementAndGet();
    }

    @Override
    public void onExpiration(Session session) {
        sessionCount.decrementAndGet();
    }
    public AtomicInteger getSessionCount(){
        return sessionCount;
    }
}

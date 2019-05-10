package com.example.redis;

import com.example.service.IRedisService;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.UnknownSessionException;
import org.apache.shiro.session.mgt.eis.AbstractSessionDAO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/13 17:20
 */
@Component
public class RedisSessionDao extends AbstractSessionDAO {
    private long expireTime=1800000;
    @Value("${server.servlet.session.timeout}")
    private int sessionTimeout;
    private String prefix="shiro-redis-session-";
    private List<String> staticFileArray = Arrays.asList(".js",".jpg",".jpeg",".css","png",".ttf",".ico");
    @Resource
    private IRedisService<Session> iRedisService;

    public  RedisSessionDao(){
        super();
    }
    public RedisSessionDao(long expireTime, IRedisService<Session> redisService){
        super();
        this.expireTime=expireTime;
        this.iRedisService=redisService;
    }
    @Override
    protected Serializable doCreate(Session session) {
        Serializable sessionId=this.generateSessionId(session);
        this.assignSessionId(session,sessionId);
        //iRedisService.put(prefix+session.getId(),session,getExpireTime());
        return sessionId;
    }

    @Override
    protected Session doReadSession(Serializable sessionId) {
        if(sessionId==null){
            return null;
        }
        return iRedisService.get(prefix+sessionId);
    }

    @Override
    public void update(Session session) throws UnknownSessionException {
        HttpServletRequest request=((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(session==null && session.getId()==null){
            return;
        }
        if(request!=null){
            String uri=request.getServletPath();
            if(endsWithAny(uri,staticFileArray)){
                return;
            }
            String updateSession=request.getParameter("updateSession");
            if("0".equals(updateSession)){
                return;
            }
            session.setTimeout(expireTime);
            iRedisService.put(prefix+session.getId(),session,getExpireTime());

        }
    }

    private boolean endsWithAny(String uri,List<String> staticFileArray){
        for(String suffix:staticFileArray){
            if(uri.endsWith(suffix)){
                return true;
            }
        }
        return false;
    }

    @Override
    public void delete(Session session) {
        if(null==session){
            return;
        }
        iRedisService.removed(prefix+session.getId());
    }

    @Override
    public Collection<Session> getActiveSessions() {
        return iRedisService.getAll();
    }

    public long getExpireTime() {
        return expireTime;
    }

    public void setExpireTime(long expireTime) {
        this.expireTime = expireTime;
    }

    public IRedisService<Session> getiRedisService() {
        return iRedisService;
    }

    public void setiRedisService(IRedisService<Session> iRedisService) {
        this.iRedisService = iRedisService;
    }
}

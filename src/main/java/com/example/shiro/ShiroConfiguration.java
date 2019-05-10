package com.example.shiro;

import com.example.redis.RedisSessionDao;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import java.util.*;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/6 11:28
 */
@Configuration
public class ShiroConfiguration {
    @Value(value = "${server.servlet.session.timeout}")
    private int tomcatTimeout=3;
    @Bean
    public MyShiroRealm myShiroRealm(){
        MyShiroRealm myShiroRealm=new MyShiroRealm();
        return myShiroRealm;
    }
    @Bean
    public DefaultWebSecurityManager securityManager(){
        DefaultWebSecurityManager securityManager=new DefaultWebSecurityManager();
        securityManager.setRealm(myShiroRealm());
        securityManager.setCacheManager(ehCacheManager());
        securityManager.setSessionManager(sessionManager());
        return securityManager;
    }
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(DefaultWebSecurityManager securityManager){
        ShiroFilterFactoryBean filterFactoryBean=new ShiroFilterFactoryBean();
        filterFactoryBean.setSecurityManager(securityManager);
        Map<String,String> map=new HashMap<>();
        map.put("/logout","logout");
        map.put("/**","anon");
        map.put("/user/**","authc");
        filterFactoryBean.setLoginUrl("/login/login");
        filterFactoryBean.setSuccessUrl("/success/index");
        filterFactoryBean.setUnauthorizedUrl("/error/error");
        filterFactoryBean.setFilterChainDefinitionMap(map);
        return filterFactoryBean;
    }
    @Bean
    public AuthorizationAttributeSourceAdvisor sourceAdvisor(SecurityManager securityManager){
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor=new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }
    /*
    @Bean("cacheManager1")
    public CacheManager cacheManager(){
        return CacheManager.create();
    }
     */
    @Bean
    public EhCacheManager ehCacheManager(){
        EhCacheManager cacheManager=new EhCacheManager();
        //cache.setCacheManagerConfigFile("classpath:ehcache.xml");
        //cache.setCacheManager(cacheManager());
        return cacheManager;
    }
    /*
    @Bean
    public EhCacheManager ehCacheManager(){
        EhCacheManager cache=new EhCacheManager();
        cache.setCacheManager(cacheManager());
        return cache;
    }
    */
    @Bean
    public DefaultWebSessionManager sessionManager(){
        DefaultWebSessionManager sessionManager=new DefaultWebSessionManager();
        sessionManager.setGlobalSessionTimeout(tomcatTimeout*1000);
        sessionManager.setSessionDAO(sessoinDao());
        sessionManager.setDeleteInvalidSessions(true);
        sessionManager.setSessionValidationSchedulerEnabled(true);
        /*
        Collection<SessionListener> listeners=new ArrayList<SessionListener>();
        listeners.add(new BDSessionListener());
        sessionManager.setSessionListeners(listeners);
         */
        sessionManager.setSessionIdCookie(simpleCookie());
        return sessionManager;
    }
    /*
    @Bean
    public SessionDAO sessionDAO(){
        return new MemorySessionDAO();
    }
     */
    @Bean
    public RedisSessionDao sessoinDao(){
        return new RedisSessionDao();
    }

    @Bean
    public SimpleCookie simpleCookie(){
        SimpleCookie simpleCookie=new SimpleCookie();
        simpleCookie.setName("jeesite.session.id");
        return  simpleCookie;
    }
    @Bean
    @DependsOn("postProcessor")
    public DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator(){
        DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator=new DefaultAdvisorAutoProxyCreator();
        defaultAdvisorAutoProxyCreator.setProxyTargetClass(true);
        return defaultAdvisorAutoProxyCreator;
    }
    @Bean
    public LifecycleBeanPostProcessor postProcessor(){
        return new LifecycleBeanPostProcessor();
    }
}

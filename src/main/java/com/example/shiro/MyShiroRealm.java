package com.example.shiro;

import com.example.pojo.sysUsers.Permission;
import com.example.pojo.sysUsers.Role;
import com.example.pojo.sysUsers.User;
import com.example.service.ILoginService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/6 11:27
 */
public class MyShiroRealm extends AuthorizingRealm {
    @Autowired
    private ILoginService iLoginService;

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String name=principals.getPrimaryPrincipal().toString();
        User user=iLoginService.findName(name);
        SimpleAuthorizationInfo authorizationInfo=new SimpleAuthorizationInfo();
        for(Role role:user.getRoleList()){
            authorizationInfo.addRole(role.getRoleName());
            for(Permission permission:role.getPermissionList()){
                authorizationInfo.addStringPermission(permission.getPermission());
            }
        }
        return authorizationInfo;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        if(token.getPrincipal()==null){
            return null;
        }
        String name=token.getPrincipal().toString();
        User user=iLoginService.findName(name);
        if(name==null){
            return  null;
        }else {
            SimpleAuthenticationInfo simpleAuthenticationInfo=new SimpleAuthenticationInfo(name,user.getPassword(),user.getName());
            return simpleAuthenticationInfo;
        }
    }
}

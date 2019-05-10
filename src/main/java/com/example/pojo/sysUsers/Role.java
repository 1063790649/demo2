package com.example.pojo.sysUsers;

import com.example.base.BasePojo;
import lombok.Data;

import java.util.List;
@Data
public class Role implements BasePojo {
    private Integer id;

    private String roleName;

    private Integer userId;

    private List<Permission> permissionList;
}
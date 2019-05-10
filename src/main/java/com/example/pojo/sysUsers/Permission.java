package com.example.pojo.sysUsers;

import com.example.base.BasePojo;
import lombok.Data;

@Data
public class Permission implements BasePojo {
    private Integer id;

    private String permission;

    private Integer roleId;

}
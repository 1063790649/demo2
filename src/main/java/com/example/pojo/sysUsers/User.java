package com.example.pojo.sysUsers;

import com.example.base.BasePojo;
import lombok.Data;

import java.util.List;
@Data
public class User implements BasePojo {
    private Integer id;

    private String password;

    private String name;

    private List<Role> roleList;
}
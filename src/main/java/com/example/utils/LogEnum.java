package com.example.utils;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/20 11:53
 */
public enum LogEnum {
    BUSSINESS("bussiness"), PLATFORM("platform"), DB("db"), EXCEPTION("exception"),;
    private String category;
    LogEnum(String category){
        this.category=category;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}

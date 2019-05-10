package com.example.base;


/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/7 9:04
 */
public interface BaseDao<T> {
    int deleteByPrimaryKey(Integer id);

    int insert(T record);

    int insertSelective(T record);

    T selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(T record);

    int updateByPrimaryKey(T record);
}

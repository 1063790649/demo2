package com.example.redis;

import org.springframework.expression.spel.ast.NullLiteral;
//import sun.rmi.runtime.NewThreadAction;

import java.io.*;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/13 17:58
 */
public class SerializeUtil {
    public  static byte[] serialize(Object object){
        ObjectOutputStream oos= null;
        ByteArrayOutputStream baos=null;
        try {
            baos=new ByteArrayOutputStream();
            oos=new ObjectOutputStream(baos);
            oos.writeObject(object);
            byte[] bytes=baos.toByteArray();
            return bytes;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    public static Object unSerialize(byte[] bytes){
        ByteArrayInputStream bis=null;
        try {
            bis= new ByteArrayInputStream(bytes);
            ObjectInputStream ois=new ObjectInputStream(bis);
            return ois.readObject();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }
}

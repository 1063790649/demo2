package com.example.base;

import org.apache.commons.lang3.StringEscapeUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * @author Cen Shijian
 * @program: demo2
 * @description
 * @date 2019/4/14 16:40
 */
public class StringUtils {
    /**
     * 替换掉HTML标签方法
     *
     * @param html
     * @return
     */
    public static String stripHtml(String html) {
        if (isBlank(html)) {
            return "";
        }
        String regEx = "<.+?>";
        Pattern pattern = Pattern.compile(regEx);
        Matcher matcher = pattern.matcher(html);
        String str = matcher.replaceAll("");
        return str;
    }

    /**
     * 缩略字符串（不区分中英文字符）
     *
     * @param str
     * @param length
     * @return
     */
    public static String abbr(String str, int length) {
        if (str == null) {
            return "";
        }
        try {
            StringBuffer stringBuffer = new StringBuffer();
            int currentLength = 0;
            for (char c : stripHtml(StringEscapeUtils.unescapeHtml4(str)).toCharArray()) {
                currentLength += String.valueOf(c).getBytes("GBK").length;
                if (currentLength <= length - 3) {
                    stringBuffer.append(c);
                } else {
                    stringBuffer.append("...");
                    break;
                }
            }
            return stringBuffer.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
}

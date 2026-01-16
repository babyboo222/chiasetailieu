package com.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AllViewAdmin {

    @GetMapping("/index")
    public String index(){
        return "admin/index";
    }

    @GetMapping("/addbaihoc")
    public String addbaihoc(){
        return "admin/addbaihoc";
    }

    @GetMapping("/baihoc")
    public String baihoc(){
        return "admin/baihoc";
    }

    @GetMapping("/danhmuccauhoi")
    public String danhmuccauhoi(){
        return "admin/danhmuccauhoi";
    }

    @GetMapping("/danhmuckhoahoc")
    public String danhmuckhoahoc(){
        return "admin/danhmuckhoahoc";
    }

    @GetMapping("/danhmuctailieu")
    public String danhmuctailieu(){
        return "admin/danhmuctailieu";
    }

    @GetMapping("/doanhthu")
    public String doanhthu(){
        return "admin/doanhthu";
    }

    @GetMapping("/hoidap")
    public String hoidap(){
        return "admin/hoidap";
    }

    @GetMapping("/khoahoc")
    public String khoahoc(){
        return "admin/khoahoc";
    }

    @GetMapping("/taikhoan")
    public String taikhoan(){
        return "admin/taikhoan";
    }

    @GetMapping("/tailieu")
    public String tailieu(){
        return "admin/tailieu";
    }

    @GetMapping("/themkhoahoc")
    public String themkhoahoc(){
        return "admin/themkhoahoc";
    }

    @GetMapping("/tracnghiem")
    public String tracnghiem(){
        return "admin/tracnghiem";
    }

}

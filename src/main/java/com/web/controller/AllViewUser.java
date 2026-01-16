package com.web.controller;
import com.web.entity.User;
import com.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AllViewUser {

    @GetMapping(value = {"/index","/"})
    public String index(){
        return "user/index";
    }

    @GetMapping(value = {"/cauhoi"})
    public String cauhoi(){
        return "user/cauhoi";
    }

    @GetMapping(value = {"/chitietkhoahoc"})
    public String chitietkhoahoc(){
        return "user/chitietkhoahoc";
    }

    @GetMapping(value = {"/chitiettailieu"})
    public String chitiettailieu(){
        return "user/chitiettailieu";
    }

    @GetMapping(value = {"/dangky"})
    public String dangky(){
        return "user/dangky";
    }

    @GetMapping(value = {"/dangtailieu"})
    public String dangtailieu(){
        return "user/dangtailieu";
    }

    @GetMapping(value = {"/giohang"})
    public String giohang(){
        return "user/giohang";
    }

    @GetMapping(value = {"/gioithieukhoahoc"})
    public String gioithieukhoahoc(){
        return "user/gioithieukhoahoc";
    }

    @GetMapping(value = {"/khoahoc"})
    public String khoahoc(){
        return "user/khoahoc";
    }

    @GetMapping(value = {"/login"})
    public String login(){
        return "user/login";
    }

    @GetMapping(value = {"/quenmatkhau"})
    public String quenmatkhau(){
        return "user/quenmatkhau";
    }

    @GetMapping(value = {"/taikhoan"})
    public String taikhoan(){
        return "user/taikhoan";
    }

    @GetMapping(value = {"/tailieu"})
    public String tailieu(){
        return "user/tailieu";
    }

    @GetMapping(value = {"/taocauhoi"})
    public String taocauhoi(){
        return "user/taocauhoi";
    }

    @GetMapping(value = {"/tracnghiem"})
    public String tracnghiem(){
        return "user/tracnghiem";
    }

    @GetMapping(value = {"/xacthuc"})
    public String xacthuc(){
        return "user/xacthuc";
    }


    @GetMapping(value = {"/thanhcong"})
    public String thanhcong(){
        return "user/thanhcong";
    }

}

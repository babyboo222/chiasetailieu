package com.web.api;

import com.web.dto.*;
import com.web.entity.User;
import com.web.exception.MessageException;
import com.web.jwt.JwtTokenProvider;
import com.web.repository.UserRepository;
import com.web.service.UserService;
import com.web.utils.Contains;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.apache.tomcat.util.http.HeaderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserResource {

    private final UserRepository userRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserUtils userUtils;

    private final MailService mailService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResource(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, UserUtils userUtils, MailService mailService) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userUtils = userUtils;
        this.mailService = mailService;
    }

    @PostMapping("/login")
    public TokenDto authenticate(@RequestBody LoginDto loginDto) throws Exception {
        TokenDto tokenDto = userService.login(loginDto.getUsername(), loginDto.getPassword());
        return tokenDto;
    }

    @PostMapping("/regis")
    public ResponseEntity<?> regisUser(@RequestBody User user) throws URISyntaxException {
        User result= userService.regisUser(user);
        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @PostMapping("/active-account")
    public ResponseEntity<?> activeAccount(@RequestParam String email, @RequestParam String key) throws URISyntaxException {
        userService.activeAccount(key, email);
        return new ResponseEntity<>("kích hoạt thành công", HttpStatus.OK);
    }

    @GetMapping("/admin/check-role-admin")
    public void checkRoleAdmin(){
        System.out.println("admin");
    }

    @GetMapping("/user/check-role-user")
    public void checkRoleUser(){
        System.out.println("user");
    }

    @PostMapping("/user/changePassword")
    public void changePassword(@RequestParam("old") String oldPass, @RequestParam("new") String newPass) throws Exception {
        User user = userUtils.getUserWithAuthority();
        if(passwordEncoder.matches(oldPass, user.getPassword())){
            user.setPassword(passwordEncoder.encode(newPass));
        }
        else{
            throw new MessageException("Mật khẩu cũ không đúng", 400);
        }
        userRepository.save(user);
    }

    @PostMapping("/user/updateUser")
    public void updateInfor(@RequestBody User userDto){
        Optional<User> optionalUser = userRepository.findByEmailAndUserId(userDto.getEmail(), userDto.getId());
        if(optionalUser.isPresent()){
            throw new MessageException("Email đã được sử dụng", 400);
        }
        User user = userUtils.getUserWithAuthority();
        user.setFullname(userDto.getFullname());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        user.setAvatar(userDto.getAvatar());
        userRepository.save(user);
    }

    @GetMapping("/user/userlogged")
    public User getUserLogged(){
        return userUtils.getUserWithAuthority();
    }


    @GetMapping("/admin/getUserByRole")
    public List<User> getUserNotAdmin(@RequestParam(value = "role", required = false) String role) {
        if(role == null){
            return userRepository.findAll();
        }
        return userRepository.getUserByRole(role);
    }

    @PostMapping("/admin/activeUser")
    public void activeOrUnactiveUser(@RequestParam("id") Long id){
        User user = userRepository.findById(id).get();
        if(user.getActived() == true){
            user.setActived(false);
            userRepository.save(user);
            return;
        }
        else{
            user.setActived(true);
            userRepository.save(user);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> changePassword(@RequestParam String email){
        userService.forgotPassword(email);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @GetMapping("/public/countUser")
    public Long count(){
        return userRepository.count();
    }

    @GetMapping("/admin/newUser")
    public List<User> newUser(){
        return userRepository.getNewUser(Contains.ROLE_USER);
    }
}

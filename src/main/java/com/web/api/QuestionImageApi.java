package com.web.api;

import com.web.repository.QuestionImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class QuestionImageApi {

    @Autowired
    private QuestionImageRepository questionImageRepository;

    @DeleteMapping("/user/deleteImageQuestion")
    public void delete(@RequestParam("id") Long id){
        questionImageRepository.deleteById(id);
    }
}

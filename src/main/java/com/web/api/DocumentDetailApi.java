package com.web.api;

import com.web.repository.DocumentDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class DocumentDetailApi {

    @Autowired
    private DocumentDetailRepository documentDetailRepository;

    @DeleteMapping("/user/deleteDocDetail")
    public void deleteByID(@RequestParam("id") Long id){
        documentDetailRepository.deleteById(id);
    }
}

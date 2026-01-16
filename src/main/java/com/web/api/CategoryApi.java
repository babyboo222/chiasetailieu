package com.web.api;

import com.web.entity.Category;
import com.web.exception.MessageException;
import com.web.repository.CategoryRepository;
import com.web.utils.CategoryType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CategoryApi {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/admin/addOrUpdateCategory")
    public ResponseEntity<?> saveOrUpdate(@RequestBody Category category){
        if(category.getId() == null){
            category.setCreatedDate(new Date(System.currentTimeMillis()));
        }
        else{
            Optional<Category> optionalCategory = categoryRepository.findById(category.getId());
            if(optionalCategory.isEmpty()){
                throw new MessageException("Không tìm thấy danh mục: "+category.getId());
            }
            category.setCreatedDate(optionalCategory.get().getCreatedDate());
        }
        Category result = categoryRepository.save(category);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/public/findCategoryByType")
    public List<Category> findCategoryByType(@RequestParam String type){
        CategoryType categoryType = null;
        for(CategoryType c : CategoryType.values()){
            if(c.name().equals(type)){
                categoryType = c;
            }
        }
        return categoryRepository.findByType(categoryType);
    }

    @GetMapping("/admin/categoryById")
    public Category findById(@RequestParam("id") Long id){
        return categoryRepository.findById(id).get();
    }

    @DeleteMapping("/admin/deleteCategory")
    public void deleteCategory(@RequestParam("id") Long id){
        try {
            categoryRepository.deleteById(id);
        }catch (Exception e){
            Category category = categoryRepository.findById(id).get();
            category.setDeleted(true);
            categoryRepository.save(category);
        }
    }

}

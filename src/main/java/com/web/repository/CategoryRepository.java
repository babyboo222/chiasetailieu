package com.web.repository;

import com.web.entity.Authority;
import com.web.entity.Category;
import com.web.utils.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category,Long> {

    @Query("select c from Category c where c.categroryType = ?1 and c.deleted = false ")
    public List<Category> findByType(CategoryType categoryType);
}

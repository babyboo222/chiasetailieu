package com.web.repository;

import com.web.entity.Category;
import com.web.entity.QuestionImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionImageRepository extends JpaRepository<QuestionImage,Long> {
}

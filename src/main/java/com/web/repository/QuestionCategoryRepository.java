package com.web.repository;

import com.web.entity.Category;
import com.web.entity.QuestionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface QuestionCategoryRepository extends JpaRepository<QuestionCategory,Long> {

    @Modifying
    @Transactional
    @Query("delete from QuestionCategory q where q.question.id = ?1")
    int deleteByQuestion(Long questionId);
}

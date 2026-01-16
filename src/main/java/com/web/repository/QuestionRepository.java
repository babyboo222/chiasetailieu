package com.web.repository;

import com.web.entity.Category;
import com.web.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question,Long> {

    @Query("select q from Question q where q.user.id = ?1")
    Page<Question> findByUser(Long userId, Pageable pageable);

    @Query("select q from Question q inner join q.questionCategories ca where q.title like ?1 or q.content like ?1 or ca.category.name like ?1 group by q.id")
    Page<Question> findByParam(String param, Pageable pageable);

    @Query("select q from Question q inner join q.questionCategories ca where (q.title like ?1 or q.content like ?1 or ca.category.name like ?1) and ca.category.id = ?2 group by q.id")
    Page<Question> findByParamAndCategory(String param, Long categoryId, Pageable pageable);

    @Query("select q from Question q where q.createdDate >= ?1 and q.createdDate <=?2")
    Page<Question> getForAdmin(Date start, Date end, Pageable pageable);
}

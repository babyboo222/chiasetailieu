package com.web.repository;

import com.web.entity.Category;
import com.web.entity.QuestionLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface QuestionLikeRepository extends JpaRepository<QuestionLike,Long> {

    @Query("select q from QuestionLike q where q.user.id = ?1 and q.question.id = ?2")
    public Optional<QuestionLike> findByUserAndQuestion(Long userId, Long questionId);
}

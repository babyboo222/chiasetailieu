package com.web.repository;

import com.web.entity.Category;
import com.web.entity.QuestionCommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionCommentLikeRepository extends JpaRepository<QuestionCommentLike,Long> {
}

package com.web.repository;

import com.web.entity.Category;
import com.web.entity.QuestionComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionCommentRepository extends JpaRepository<QuestionComment,Long> {

    @Query("select q from QuestionComment q where q.question.id = ?1 and (q.parentComment.id is null or q.usernameReciver is null)")
    public Page<QuestionComment> findByQuestion(Long questionId, Pageable pageable);

    @Query("select q.content from QuestionComment q where q.id = ?1")
    public String getContent(Long id);

    @Query("select q from QuestionComment q where q.parentComment.id = ?1")
    public List<QuestionComment> getByParentComment(Long id);
}

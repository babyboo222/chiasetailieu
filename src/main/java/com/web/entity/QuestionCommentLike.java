package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "question_comment_like")
@Getter
@Setter
public class QuestionCommentLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean unLike;

    @ManyToOne
    @JoinColumn(name = "questionComment_id")
    private QuestionComment questionComment;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

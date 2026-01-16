package com.web.dto;

import com.web.entity.Question;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionResponse {

    private Question question;

    private Boolean unLike;


}

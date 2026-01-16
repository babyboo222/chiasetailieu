package com.web.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class QuestionDto {

    private Long id;

    private String title;

    private String content;

    private List<Long> categoryId;

    private List<String> listLinkImage;
}

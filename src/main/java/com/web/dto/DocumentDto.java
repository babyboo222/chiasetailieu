package com.web.dto;

import com.web.entity.DocumentDetail;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DocumentDto {

    private Long id;

    private String name;

    private String linkImage;

    private String description;

    private List<DocumentDetail> documentDetails;

    private List<Long> listIdCategory;
}

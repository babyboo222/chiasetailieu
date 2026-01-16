package com.web.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PayDto {

    String orderId;
    String requestId;
    Double amount;
    String urlVnpay;
    List<Long> idCourse;
}

package com.eafit.extra.hours.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HourTypeDTO {

    private Integer id;
    private String description;
    private BigDecimal percentage;
}

package com.eafit.extra.hours.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDetailsDTO {

    private String employeeId;
    private String employeeName;
    private BigDecimal salary;        // Changed from Double to BigDecimal
    private String areaName;
    private String jobName;
    private BigDecimal hourPrice;  // Changed from Double to BigDecimal
}

    /*public EmployeeDetailsDTO(String employeeId, String employeeName, Double salary, String areaName, String jobName, Double laborHoursPerMonth) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.salary = salary;
        this.areaName = areaName;
        this.jobName = jobName;
        this.laborHoursPerMonth = laborHoursPerMonth;
    }*/

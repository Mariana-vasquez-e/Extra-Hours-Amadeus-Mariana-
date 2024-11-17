package com.eafit.extra.hours.repository;

import java.math.BigDecimal;

public interface EmployeeDetailsDTO {

    String getEmployeeId();
    String getEmployeeName();
    BigDecimal getSalary();
    String getAreaName();
    String getJobName();
    BigDecimal getHourPrice();
}

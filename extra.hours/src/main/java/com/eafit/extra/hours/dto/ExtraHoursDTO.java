package com.eafit.extra.hours.dto;

import com.eafit.extra.hours.entity.HorasExtras;

import com.eafit.extra.hours.entity.OurUsers;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//import java.time.LocalDateTime;

@Data
public class ExtraHoursDTO {

    @NotNull
    //private String employeeId;
    private EmployeeDTO employee;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDatetime;

    @NotNull
    private BigDecimal hourPrice;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDatetime;

    @NotNull
    private BigDecimal amountExtraHours;

    private String comments;

    @NotNull
    private BigDecimal totalExtraHour;

    @NotNull
    private BigDecimal totalPayment;

    @NotNull
    //private Integer employee;

    @NotNull
    //private Integer extraHourType;

    //private EmployeeDTO employee;
    private HourTypeDTO extraHourType;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeDTO {
        private String employeeId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HourTypeDTO {
        private Integer id;
    }

    // Getters and Setters
    /*public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(double totalHours) {
        this.totalHours = totalHours;
    }

    public String getItArea() {
        return itArea;
    }

    public void setItArea(String itArea) {
        this.itArea = itArea;
    }*/
}

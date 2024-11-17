package com.eafit.extra.hours.service;

//import com.eafit.extra.hours.dto.EmployeeDetailsDTO;
import com.eafit.extra.hours.entity.Employees;
import com.eafit.extra.hours.entity.HourTypes;
import com.eafit.extra.hours.repository.*;
import com.eafit.extra.hours.dto.ExtraHoursDTO;
import com.eafit.extra.hours.dto.UserExtraHoursDTO;
import com.eafit.extra.hours.entity.HorasExtras;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ExtraHoursService {

    private static final Logger logger = LoggerFactory.getLogger(ExtraHoursService.class);

    @Autowired
    private ExtraHoursRepository extraHoursRepository;

    @Autowired
    private EmployeesRepository employeesRepository;

    @Autowired
    private final HourTypesRepository hourTypesRepository;

    @Autowired
    private  final HorasExtrasRepository horasExtrasRepository;

    // insertar una hora extra
    public HorasExtras createExtraHours(ExtraHoursDTO dto) {
        // First, fetch the employee using employeeId
        Employees employee = employeesRepository.findByEmployeeId(dto.getEmployee().getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + dto.getEmployee().getEmployeeId()));

        // Fetch the hour type
        HourTypes hourType = hourTypesRepository.findById(dto.getExtraHourType().getId())
                .orElseThrow(() -> new EntityNotFoundException("Hour type not found with ID: " + dto.getExtraHourType().getId()));

        // Validate and calculate hours
        BigDecimal amountExtraHours = calculateHours(dto.getStartDatetime(), dto.getEndDatetime());

        // Calculate totalExtraHour
        BigDecimal totalExtraHour = calculateTotalExtraHour(
                dto.getHourPrice(),
                hourType.getPercentage()
        );

        // Calculate totalPayment
        BigDecimal totalPayment = calculateTotalPayment(
                employee.getSalary(),
                totalExtraHour
        );

        // Create and populate the HorasExtras entity
        /*HorasExtras horasExtras = HorasExtras.builder()
                .hourPrice(dto.getHourPrice())
                .startDatetime(convertToLocalDateTime(dto.getStartDatetime()))
                .endDatetime(convertToLocalDateTime(dto.getEndDatetime()))
                .amountExtraHours(dto.getAmountExtraHours())
                .comments(dto.getComments())
                .totalExtraHour(dto.getTotalExtraHour())
                .totalPayment(dto.getTotalPayment())
                .employee(employee)
                .extraHourType(hourType)
                .build();*/
        // Create and populate the HorasExtras entity
        HorasExtras horasExtras = HorasExtras.builder()
                .hourPrice(dto.getHourPrice())
                .startDatetime(dto.getStartDatetime())
                .endDatetime(dto.getEndDatetime())
                .amountExtraHours(amountExtraHours)
                .comments(dto.getComments())
                .totalExtraHour(totalExtraHour)
                .totalPayment(totalPayment)
                .employee(employee)
                .extraHourType(hourType)
                .build();

        return extraHoursRepository.save(horasExtras);
    }

    private Employees createEmployee(EmployeeDetailsDTO employeeDto) {
        Employees employee = Employees.builder()
                .employeeId(employeeDto.getEmployeeId())
                .build();
        return employeesRepository.save(employee);
    }

    private LocalDateTime convertToLocalDateTime(LocalDateTime dateTime) {
        return dateTime;
    }

    private LocalDateTime convertToLocalDateTime(String dateTimeString) {
        return LocalDateTime.parse(dateTimeString, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    private BigDecimal calculateHours(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime == null || endDateTime == null) {
            throw new IllegalArgumentException("Start and end dates cannot be null");
        }

        Duration duration = Duration.between(startDateTime, endDateTime);
        double hours = duration.toMinutes() / 60.0;

        return BigDecimal.valueOf(hours).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateTotalExtraHour(BigDecimal hourPrice, BigDecimal percentage) {
        return hourPrice.multiply(percentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateTotalPayment(BigDecimal salary, BigDecimal totalExtraHour) {
        return salary.add(totalExtraHour).setScale(2, RoundingMode.HALF_UP);
    }

    public List<HorasExtras> getAllExtraHours() {
        //return extraHoursRepository.findAll();
        List<HorasExtras> extraHours = extraHoursRepository.findAll();
        logger.info("Extra hours retrieved: {}", extraHours);
        return extraHours;
    }

    public List<UserExtraHoursDTO> getExtraHoursByEmail(String email) {
        return extraHoursRepository.findUserExtraHoursByEmail(email);
    }

    public HorasExtras createExtraHours(HorasExtras horasExtras) {
        return extraHoursRepository.save(horasExtras);
    }

    public EmployeeDetailsDTO getEmployeeDetails(String employeeId) {
        return employeesRepository.findEmployeeDetailsByEmployeeId(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));
    }

    public void deleteExtraHourById(Integer id) {
        if (!horasExtrasRepository.existsById(id)) {
            throw new EntityNotFoundException("Extra hour record with ID " + id + " not found");
        }
        horasExtrasRepository.deleteById(id);
    }
}

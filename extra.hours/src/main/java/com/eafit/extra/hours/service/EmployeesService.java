package com.eafit.extra.hours.service;

import com.eafit.extra.hours.entity.Employees;
import com.eafit.extra.hours.dto.EmployeeDetailsDTO;
import com.eafit.extra.hours.repository.EmployeesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeesService {

    private final EmployeesRepository employeesRepository;

    public List<EmployeeDetailsDTO> getAllEmployees() {
        return employeesRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EmployeeDetailsDTO mapToDTO(Employees employee) {
        return new EmployeeDetailsDTO(
                employee.getEmployeeId(),
                employee.getEmployeeName(),
                employee.getSalary(),
                employee.getArea().getAreaName(),
                employee.getJob().getJobName(),
                null // hourPrice is not part of the Employees entity; set it if needed
        );
    }
}

package com.eafit.extra.hours.controller;

import com.eafit.extra.hours.dto.EmployeeDetailsDTO;
import com.eafit.extra.hours.service.EmployeesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmployeesController {

    private final EmployeesService employeesService;

    @GetMapping("/list-employees")
    public ResponseEntity<List<EmployeeDetailsDTO>> getAllEmployees() {
        List<EmployeeDetailsDTO> employees = employeesService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }
}

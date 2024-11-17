package com.eafit.extra.hours.repository;

//import com.eafit.extra.hours.dto.EmployeeDetailsDTO;
import com.eafit.extra.hours.dto.UserExtraHoursDTO;
import com.eafit.extra.hours.entity.Employees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeesRepository extends JpaRepository<Employees, String> {

    //para traer todos los datos de la tabla employess
    Optional<Employees> findByEmployeeId(String employeeId);

    //Para buscar un empleado por id antes de insertarlo
    @Query(nativeQuery = true,
            value = "SELECT " +
                    "e.employee_id as employeeId, " +
                    "e.employee_name as employeeName, " +
                    "e.salary as salary, " +
                    "a.area_name as areaName, " +
                    "j.job_name as jobName, " +
                    "ROUND(CAST(COALESCE(e.salary, 0) AS DECIMAL(10,2)) / 240, 2) as hourPrice " +  // Changed alias to match exactly
                    "FROM employees e " +
                    "JOIN areas a ON e.area_id = a.area_id " +
                    "JOIN jobs j ON e.job_id = j.job_id " +
                    "WHERE e.employee_id = :employeeId")
    Optional<EmployeeDetailsDTO> findEmployeeDetailsByEmployeeId(@Param("employeeId") String employeeId);

    //
    //Para buscar un empleado por id antes de insertarlo
    @Query(nativeQuery = true,
            value = "SELECT " +
                    "e.employee_id as employeeId, " +
                    "e.employee_name as employeeName, " +
                    "e.salary as salary, " +
                    "a.area_name as areaName, " +
                    "j.job_name as jobName, " +
                    "ROUND(CAST(COALESCE(e.salary, 0) AS DECIMAL(10,2)) / 240, 2) as hourPrice " +  // Changed alias to match exactly
                    "FROM employees e " +
                    "JOIN areas a ON e.area_id = a.area_id " +
                    "JOIN jobs j ON e.job_id = j.job_id ")
    Optional<EmployeeDetailsDTO> getAllEmployees();

}

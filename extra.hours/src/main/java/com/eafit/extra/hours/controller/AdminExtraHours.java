package com.eafit.extra.hours.controller;

//import com.eafit.extra.hours.dto.EmployeeDetailsDTO;
import com.eafit.extra.hours.dto.HourTypeDTO;
import com.eafit.extra.hours.repository.EmployeeDetailsDTO;
import com.eafit.extra.hours.dto.ExtraHoursDTO;
import com.eafit.extra.hours.dto.UserExtraHoursDTO;
import com.eafit.extra.hours.entity.HorasExtras;
import com.eafit.extra.hours.service.ExtraHoursService;
import com.eafit.extra.hours.service.HourTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class AdminExtraHours {

    @Autowired
    private ExtraHoursService extraHoursService;

    @Autowired
    private HourTypeService hourTypeService;

    /* Listar todas las horas extras ADMIN*/
    @GetMapping("/list-eh")
    public List<HorasExtras> getAllExtraHours(@AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("Usuario: " + userDetails.getUsername());
        System.out.println("Roles: " + userDetails.getAuthorities());

        return extraHoursService.getAllExtraHours();
        //System.out.println("EmployeeId: " + employeeId);
    }

    /* Listar las horas extras email de usuario */
    @GetMapping("/list-eh-user")
    public List<UserExtraHoursDTO> getAllExtraHoursByUser(@RequestParam("email") String email) {
        return extraHoursService.getExtraHoursByEmail(email);
    }

    // Ejemplo de uso
    @GetMapping("/employee/{id}")
    public ResponseEntity<EmployeeDetailsDTO> getEmployeeDetails(@PathVariable String id) {

        return ResponseEntity.ok(extraHoursService.getEmployeeDetails(id));
    }

    @PostMapping("/create")
    public ResponseEntity<HorasExtras> createExtraHours(@RequestBody ExtraHoursDTO horasExtrasDTO) {
        HorasExtras horasExtras =extraHoursService.createExtraHours(horasExtrasDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(horasExtras);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteExtraHour(@PathVariable Integer id) {
        extraHoursService.deleteExtraHourById(id);
        return ResponseEntity.noContent().build();
    }

    /*@PostMapping("/update")
    public ResponseEntity<Void> updateExtrahours(@RequestBody @Valid ExtraHoursDTO extraHoursDTO) {
        extraHoursService.updateExtraHours(extraHoursDTO);
        return ResponseEntity.ok().build();
    }*/

    @GetMapping("/list-hour-types")
    public ResponseEntity<List<HourTypeDTO>> getAllHourTypes(){

        return ResponseEntity.ok(hourTypeService.getAllHoursTypes());
    }
}

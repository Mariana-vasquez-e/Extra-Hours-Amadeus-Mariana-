package com.eafit.extra.hours.service;

import com.eafit.extra.hours.dto.HourTypeDTO;
import com.eafit.extra.hours.entity.HourTypes;
import com.eafit.extra.hours.repository.HourTypesRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HourTypeService {

    @Autowired
    private final HourTypesRepository hourTypesRepository;

    public List<HourTypeDTO> getAllHoursTypes(){

        return hourTypesRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private HourTypeDTO convertToDTO(HourTypes hourTypes){
        HourTypeDTO hourTypeDTO = new HourTypeDTO();
        BeanUtils.copyProperties(hourTypes,hourTypeDTO);
        return hourTypeDTO;
    }
}

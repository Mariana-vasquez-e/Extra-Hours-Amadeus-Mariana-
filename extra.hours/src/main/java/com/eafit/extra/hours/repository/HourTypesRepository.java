package com.eafit.extra.hours.repository;

import com.eafit.extra.hours.entity.HourTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HourTypesRepository extends JpaRepository<HourTypes, Integer> {
}

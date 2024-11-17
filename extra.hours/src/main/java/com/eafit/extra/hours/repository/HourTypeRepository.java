package com.eafit.extra.hours.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.eafit.extra.hours.entity.HourTypes;

@Repository
public interface HourTypeRepository extends JpaRepository<HourTypes, Integer> {

}

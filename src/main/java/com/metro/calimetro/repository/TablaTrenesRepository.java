package com.metro.calimetro.repository;

import com.metro.calimetro.domain.TablaTrenes;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the TablaTrenes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TablaTrenesRepository extends JpaRepository<TablaTrenes, Long> {

}

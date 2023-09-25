package com.incite.o360v.repository;

import com.incite.o360v.domain.Brand;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Brand entity.
 */
@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    default Optional<Brand> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Brand> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Brand> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select brand from Brand brand left join fetch brand.area", countQuery = "select count(brand) from Brand brand")
    Page<Brand> findAllWithToOneRelationships(Pageable pageable);

    @Query("select brand from Brand brand left join fetch brand.area")
    List<Brand> findAllWithToOneRelationships();

    @Query("select brand from Brand brand left join fetch brand.area where brand.id =:id")
    Optional<Brand> findOneWithToOneRelationships(@Param("id") Long id);
}

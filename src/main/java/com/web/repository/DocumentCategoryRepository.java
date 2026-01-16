package com.web.repository;

import com.web.entity.Category;
import com.web.entity.DocumentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface DocumentCategoryRepository extends JpaRepository<DocumentCategory,Long> {

    @Modifying
    @Transactional
    @Query("delete from DocumentCategory d where d.document.id = ?1")
    int deleteByDoc(Long docId);
}

package com.web.repository;

import com.web.entity.Category;
import com.web.entity.Document;
import com.web.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.print.Doc;
import java.sql.Date;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document,Long> {

    @Query("select d from Document d where d.user.id = ?1")
    public Page<Document> findByUser(Long userId, Pageable pageable);

    @Query("select d from Document d where d.name like ?1 or d.description like ?1 or d.user.username = ?1")
    public Page<Document> findBySearch(String search, Pageable pageable);

    @Query("select d from Document d inner join d.documentCategories dc where (d.name like ?1 or d.description like ?1 or d.user.username = ?1) and (dc.category.id = ?2) group by d.id")
    public Page<Document> findBySearchAndCategory(String search, Long category, Pageable pageable);

    @Query("select d from Document d inner join d.documentCategories dc where dc.category.id = ?1 group by d.id")
    public List<Document> taiLieuLienQuan(Long idcategory);

    @Query("select d from Document d where d.createdDate >= ?1 and d.createdDate <= ?2 ")
    Page<Document> getForAdmin(Date start, Date end, Pageable pageable);
}

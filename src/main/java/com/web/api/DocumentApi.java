package com.web.api;

import com.web.dto.DocumentDto;
import com.web.entity.*;
import com.web.repository.DocumentCategoryRepository;
import com.web.repository.DocumentDetailRepository;
import com.web.repository.DocumentRepository;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.print.Doc;
import java.sql.Date;
import java.sql.Time;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class DocumentApi {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentDetailRepository documentDetailRepository;

    @Autowired
    private DocumentCategoryRepository documentCategoryRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private MailService mailService;

    @PostMapping("/user/uploadDocument")
    public Document saveOrUpdate(@RequestBody DocumentDto dto){
        Document document = new Document();
        document.setId(dto.getId());
        document.setCreatedDate(new Date(System.currentTimeMillis()));
        document.setCreatedTime(new Time(System.currentTimeMillis()));
        document.setDescription(dto.getDescription());
        document.setName(dto.getName());
        document.setUser(userUtils.getUserWithAuthority());
        document.setNumberView(0);
        document.setNumberDownload(0);
        document.setLinkImage(dto.getLinkImage());
        if(document.getId() != null){
            Optional<Document> optional = documentRepository.findById(dto.getId());
            document.setNumberDownload(optional.get().getNumberDownload());
            document.setNumberView(optional.get().getNumberView());
        }
        Document result = documentRepository.save(document);
        for(DocumentDetail s : dto.getDocumentDetails()){
            s.setDocument(result);
            documentDetailRepository.save(s);
        }
        documentCategoryRepository.deleteByDoc(result.getId());
        for(Long s : dto.getListIdCategory()){
            DocumentCategory documentCategory = new DocumentCategory();
            documentCategory.setDocument(result);
            Category category = new Category();
            category.setId(s);
            documentCategory.setCategory(category);
            documentCategoryRepository.save(documentCategory);
        }

        return result;
    }

    @GetMapping("/user/myDocument")
    public Page<Document> getMyDocument(Pageable pageable){
        Page<Document> page = documentRepository.findByUser(userUtils.getUserWithAuthority().getId(),  pageable);
        return page;
    }

    @GetMapping("/public/allDocumentPublic")
    public Page<Document> getDocumentForPublic(@RequestParam(value = "search", required = false) String search,
                                               @RequestParam(value = "category", required = false) Long category,Pageable pageable){
        if(search == null){
            search = "";
        }
        Page<Document> page = null;
        if(category == null){
            page = documentRepository.findBySearch("%"+search+"%", pageable);
        }
        else{
            page = documentRepository.findBySearchAndCategory("%"+search+"%", category, pageable);
        }
        return page;
    }

    @GetMapping("/public/documentByUser")
    public Document findByIdForUser(@RequestParam("id") Long id){
        return documentRepository.findById(id).get();
    }

    @GetMapping("/public/documentPublic")
    public Document documentPublic(@RequestParam("id") Long id){
        Document document = documentRepository.findById(id).get();
        document.setNumberView(document.getNumberView() + 1);
        Document result = documentRepository.save(document);
        return result;
    }

    @GetMapping("/public/documentLienQuan")
    public Set<Document> taiLieuLienQuan(@RequestParam("id") Long idDocument){
        Document document = documentRepository.findById(idDocument).get();
        Set<Document> set = new HashSet<>();
        for(DocumentCategory d : document.getDocumentCategories()){
            set.addAll(documentRepository.taiLieuLienQuan(d.getCategory().getId()));
        }
        return set;
    }

    @PostMapping("/public/updateDownload")
    public void updateDownload(@RequestParam("id") Long id){
        Document document = documentRepository.findById(id).get();
        document.setNumberDownload(document.getNumberDownload() + 1);
        documentRepository.save(document);
    }

    @DeleteMapping("/user/deleteDocument")
    public void deleteByID(@RequestParam("id") Long id){
        documentRepository.deleteById(id);
    }


    @GetMapping("/public/allDocumentByAdmin")
    public List<Document> getForAdmin(@RequestParam(value = "start", required = false) Date start,
                                      @RequestParam(value = "end", required = false) Date end,
                                      Pageable pageable){
        if(start == null || end == null){
            start = Date.valueOf("2000-01-01");
            end = Date.valueOf("2100-01-01");
        }
        return documentRepository.getForAdmin(start,end,pageable).getContent();
    }


    @PostMapping("/admin/deleteDocument")
    public void deleteByIDAdmin(@RequestParam("id") Long id, @RequestBody String contentDelete){
        Document document = documentRepository.findById(id).get();
        mailService.sendEmail(document.getUser().getEmail(),"Tài liệu của bạn đã bị xóa",
                "Tài liệu: <b>"+document.getName()+"</b> của bạn đã bị xóa<br>"+contentDelete, false, true);
        documentRepository.deleteById(id);
    }

    @GetMapping("/public/countDocument")
    public Long count(){
        return documentRepository.count();
    }
}

package com.web.api;

import com.web.dto.QuestionDto;
import com.web.dto.QuestionResponse;
import com.web.entity.*;
import com.web.exception.MessageException;
import com.web.repository.*;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class QuestionApi {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private QuestionImageRepository questionImageRepository;

    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuestionLikeRepository questionLikeRepository;

    @Autowired
    private MailService mailService;

    @PostMapping("/user/taoCauHoi")
    public ResponseEntity<?> saveOrUpdate(@RequestBody QuestionDto dto){
        Question question = new Question();
        if(dto.getId() != null){
            question = questionRepository.findById(dto.getId()).get();
        }
        if(dto.getId() == null){
            question.setCreatedDate(new Date(System.currentTimeMillis()));
            question.setCreatedTime(new Time(System.currentTimeMillis()));
            question.setNumberComment(0);
            question.setNumberDislike(0);
            question.setNumberLike(0);
            question.setNumberView(0);
            question.setUser(userUtils.getUserWithAuthority());
        }
        question.setTitle(dto.getTitle());
        question.setContent(dto.getContent());
        Question result = questionRepository.save(question);
        questionCategoryRepository.deleteByQuestion(result.getId());
        for(Long id : dto.getCategoryId()){
            QuestionCategory questionCategory = new QuestionCategory();
            questionCategory.setQuestion(result);
            questionCategory.setCategory(categoryRepository.findById(id).get());
            questionCategoryRepository.save(questionCategory);
        }
        for(String s : dto.getListLinkImage()){
            QuestionImage questionImage = new QuestionImage();
            questionImage.setQuestion(result);
            questionImage.setLinkImage(s);
            questionImageRepository.save(questionImage);
        }
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/user/myQuestion")
    public Page<Question> findByUser(Pageable pageable){
        return questionRepository.findByUser(userUtils.getUserWithAuthority().getId(), pageable);
    }

    @GetMapping("/public/questionById")
    public Question findById(@RequestParam("id") Long id){
        Optional<Question> question = questionRepository.findById(id);
        if(question.isEmpty()){
            throw new MessageException("Không tìm thấy question này", 404);
        }
        return question.get();
    }

    @DeleteMapping("/user/deleteQuestion")
    public void delete(@RequestParam("id") Long id){
        Question question = questionRepository.findById(id).get();
        if(question.getUser().getId() != userUtils.getUserWithAuthority().getId()){
            throw new MessageException("Bạn không đủ quyền", 401);
        }
        questionRepository.deleteById(id);
    }

    @GetMapping("/public/allQuestion")
    public Page<Question> questionsForUser(@RequestParam("search") String search,
            @RequestParam(value = "category", required = false) Long categoryId,Pageable pageable){
        if(categoryId != null){
            return questionRepository.findByParamAndCategory("%"+search+"%", categoryId,pageable);
        }
        return questionRepository.findByParam("%"+search+"%",pageable);
    }

    @GetMapping("/public/findByPublicUser")
    public Question findByPublicUser(@RequestParam("id") Long id){
        Question question = questionRepository.findById(id).get();
        question.setNumberView(question.getNumberView() + 1);
        Question result = questionRepository.save(question);
        return result;
    }

    @GetMapping("/public/allQuestionByAdmin")
    public List<Question> getForAdmin(@RequestParam(value = "start", required = false) Date start,
                                      @RequestParam(value = "end", required = false) Date end,
                                      Pageable pageable){
        if(start == null || end == null){
            start = Date.valueOf("2000-01-01");
            end = Date.valueOf("2100-01-01");
        }
        return questionRepository.getForAdmin(start,end,pageable).getContent();
    }

    @PostMapping("/admin/deleteQuestion")
    public void deleteByIDAdmin(@RequestParam("id") Long id, @RequestBody String contentDelete){
        Question question = questionRepository.findById(id).get();
        mailService.sendEmail(question.getUser().getEmail(),"Câu hỏi của bạn đã bị xóa",
                "Câu hỏi: <b>"+question.getTitle()+"</b> của bạn đã bị xóa<br>"+contentDelete, false, true);
        questionRepository.deleteById(id);
    }

    @GetMapping("/public/countQuestion")
    public Long count(){
        return questionRepository.count();
    }
}

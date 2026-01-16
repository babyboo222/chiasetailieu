package com.web.api;

import com.web.entity.Question;
import com.web.entity.QuestionComment;
import com.web.repository.QuestionCommentRepository;
import com.web.repository.QuestionRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class QuestionCommentApi {

    @Autowired
    private QuestionCommentRepository questionCommentRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserUtils userUtils;

    @PostMapping("/user/addQuestionComment")
    public QuestionComment questionComment(@RequestBody QuestionComment questionComment){
        questionComment.setCreatedDate(new Date(System.currentTimeMillis()));
        questionComment.setCreatedTime(new Time(System.currentTimeMillis()));
        questionComment.setUser(userUtils.getUserWithAuthority());
        questionComment.setNumberDislike(0);
        questionComment.setNumberLike(0);
        questionComment.setNumSubComment(0);
        QuestionComment result = questionCommentRepository.save(questionComment);
        if(result.getParentComment() != null){
            QuestionComment parent = questionCommentRepository.findById(result.getParentComment().getId()).get();
            parent.setNumSubComment(parent.getNumSubComment() + 1);
            questionCommentRepository.save(parent);
        }
        Question question = questionRepository.findById(questionComment.getQuestion().getId()).get();
        question.setNumberComment(question.getNumberComment() + 1);
        questionRepository.save(question);
        return result;
    }

    @PostMapping("/user/updateContentComment")
    public QuestionComment questionComment(@RequestParam("id") Long id, @RequestBody String content){
        QuestionComment questionComment = questionCommentRepository.findById(id).get();
        questionComment.setContent(content);
        QuestionComment result = questionCommentRepository.save(questionComment);
        return result;
    }

    @GetMapping("/public/findCommnetByQuestion")
    public Page<QuestionComment> findByQuestion(@RequestParam("id") Long idcauhoi, Pageable pageable){
        Page<QuestionComment> page = questionCommentRepository.findByQuestion(idcauhoi, pageable);

        return page;
    }

    @GetMapping("/public/getContentComment")
    public String getContent(@RequestParam("id") Long id){
        return questionCommentRepository.getContent(id);
    }


    @DeleteMapping("/user/deleteComment")
    public void deleteComment(@RequestParam("id") Long id){
        QuestionComment result = questionCommentRepository.findById(id).get();
        if(result.getParentComment() != null){
            result.getParentComment().setNumSubComment(result.getParentComment().getNumSubComment() - 1);
            questionCommentRepository.save(result.getParentComment());
        }
        Question question = questionRepository.findById(result.getQuestion().getId()).get();
        question.setNumberComment(question.getNumberComment() - 1);
        questionRepository.save(question);
        questionCommentRepository.delete(result);
    }

    @GetMapping("/public/commentByParent")
    public List<QuestionComment> getByParentComment(@RequestParam("id") Long idparentComment){
        return questionCommentRepository.getByParentComment(idparentComment);
    }
}

package com.web.api;

import com.web.dto.LikeDto;
import com.web.entity.Question;
import com.web.entity.QuestionLike;
import com.web.repository.QuestionLikeRepository;
import com.web.repository.QuestionRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class QuestionLikeApi {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionLikeRepository questionLikeRepository;

    @Autowired
    private UserUtils userUtils;

    @PostMapping("/user/likeCauHoi")
    public LikeDto likeCauHoi(@RequestParam("id") Long idcauhoi){
        LikeDto likeDto = new LikeDto();
        Optional<QuestionLike> questionLike = questionLikeRepository.findByUserAndQuestion(userUtils.getUserWithAuthority().getId(), idcauhoi);
        Question question = questionRepository.findById(idcauhoi).get();
        if(questionLike.isEmpty()){
            QuestionLike like = new QuestionLike();
            like.setUnLike(false);
            like.setQuestion(question);
            like.setUser(userUtils.getUserWithAuthority());
            questionLikeRepository.save(like);
            question.setNumberLike(question.getNumberLike() + 1);
            Question result = questionRepository.save(question);
            likeDto.setNumLike(result.getNumberLike());
            likeDto.setNumUnLike(result.getNumberDislike());
            return likeDto;
        }
        else{
            if(questionLike.get().getUnLike() == false){
                questionLikeRepository.deleteById(questionLike.get().getId());
                question.setNumberLike(question.getNumberLike() - 1);
                Question result = questionRepository.save(question);
                likeDto.setNumLike(result.getNumberLike());
                likeDto.setNumUnLike(result.getNumberDislike());
                return likeDto;
            }
            else{
                questionLike.get().setUnLike(false);
                questionLikeRepository.save(questionLike.get());
                question.setNumberLike(question.getNumberLike() + 1);
                question.setNumberDislike(question.getNumberDislike() - 1);
                Question result = questionRepository.save(question);
                likeDto.setNumLike(result.getNumberLike());
                likeDto.setNumUnLike(result.getNumberDislike());
                return likeDto;
            }
        }
    }


    @PostMapping("/user/unlikeCauHoi")
    public LikeDto unlikeCauHoi(@RequestParam("id") Long idcauhoi){
        LikeDto likeDto = new LikeDto();
        Optional<QuestionLike> questionLike = questionLikeRepository.findByUserAndQuestion(userUtils.getUserWithAuthority().getId(), idcauhoi);
        Question question = questionRepository.findById(idcauhoi).get();
        if(questionLike.isEmpty()){
            QuestionLike like = new QuestionLike();
            like.setUnLike(true);
            like.setQuestion(question);
            like.setUser(userUtils.getUserWithAuthority());
            questionLikeRepository.save(like);
            question.setNumberDislike(question.getNumberDislike() + 1);
            Question result = questionRepository.save(question);
            likeDto.setNumLike(result.getNumberLike());
            likeDto.setNumUnLike(result.getNumberDislike());
            return likeDto;
        }
        else{
            if(questionLike.get().getUnLike() == true){
                questionLikeRepository.deleteById(questionLike.get().getId());
                question.setNumberDislike(question.getNumberDislike() - 1);
                Question result = questionRepository.save(question);
                likeDto.setNumLike(result.getNumberLike());
                likeDto.setNumUnLike(result.getNumberDislike());
                return likeDto;
            }
            else{
                questionLike.get().setUnLike(true);
                questionLikeRepository.save(questionLike.get());
                question.setNumberDislike(question.getNumberDislike() + 1);
                question.setNumberLike(question.getNumberLike() - 1);
                Question result = questionRepository.save(question);
                likeDto.setNumLike(result.getNumberLike());
                likeDto.setNumUnLike(result.getNumberDislike());
                return likeDto;
            }
        }
    }

    @GetMapping("/public/checkUnlike")
    public Boolean checkUnLike(@RequestParam("id") Long idcauhoi){
        try {
            Optional<QuestionLike> questionLike = questionLikeRepository.findByUserAndQuestion(userUtils.getUserWithAuthority().getId(), idcauhoi);
            if(questionLike.isEmpty()){
                return null;
            }
            return questionLike.get().getUnLike();
        }
        catch (Exception e){
            return null;
        }
    }
}

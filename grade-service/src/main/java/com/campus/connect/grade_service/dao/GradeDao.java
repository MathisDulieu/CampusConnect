package com.campus.connect.grade_service.dao;

import com.campus.connect.grade_service.model.Grade;
import com.campus.connect.grade_service.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class GradeDao {

    private final MongoTemplate mongoTemplate;

    private static final String GRADE_COLLECTION = "GRADES";

    public void save(Grade grade) {
        mongoTemplate.save(grade, GRADE_COLLECTION);
    }

    public Optional<Grade> findById(String gradeId) {
        return Optional.ofNullable(mongoTemplate.findById(gradeId, Grade.class, GRADE_COLLECTION));
    }

    public List<Grade> findGradesByStudentId(String studentId) {
        Query query = new Query(Criteria.where("studentId").is(studentId));
        return mongoTemplate.find(query, Grade.class, GRADE_COLLECTION);
    }

    public List<Grade> findGradesByStudentIdAndCourseId(String studentId, String courseId) {
        Query query = new Query(
                Criteria.where("studentId").is(studentId)
                        .and("courseId").is(courseId)
        );
        return mongoTemplate.find(query, Grade.class, GRADE_COLLECTION);
    }

    public void delete(String gradeId) {
        mongoTemplate.remove(new Query(Criteria.where("_id").is(gradeId)), GRADE_COLLECTION);
    }
}

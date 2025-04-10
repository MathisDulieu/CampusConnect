package com.campus.connect.classroom_service.dao;

import com.campus.connect.classroom_service.model.Classroom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClassroomDao {

    private final MongoTemplate mongoTemplate;

    private static final String CLASSROOM_COLLECTION = "CLASSROOMS";

    public List<Classroom> findAllClasses() {
        return mongoTemplate.findAll(Classroom.class, CLASSROOM_COLLECTION);
    }

    public List<Classroom> findAllClassesByName(SortOrder order) {
        Query query = new Query();

        if (order == SortOrder.ASCENDING) {
            query.with(Sort.by(Sort.Direction.ASC, "name"));
        } else if (order == SortOrder.DESCENDING) {
            query.with(Sort.by(Sort.Direction.DESC, "name"));
        }

        return mongoTemplate.find(query, Classroom.class, CLASSROOM_COLLECTION);
    }

    public Optional<Classroom> findById(String classId) {
        return Optional.ofNullable(mongoTemplate.findById(classId, Classroom.class, CLASSROOM_COLLECTION));
    }

    public void save(Classroom classroom) {
        mongoTemplate.save(classroom, CLASSROOM_COLLECTION);
    }

    public void delete(String classId) {
        mongoTemplate.remove(new Query(Criteria.where("_id").is(classId)), CLASSROOM_COLLECTION);
    }
}

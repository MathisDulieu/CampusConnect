package com.campus.connect.classroom_service.dao;

import com.campus.connect.classroom_service.model.Classroom;
import com.campus.connect.classroom_service.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

import static java.util.Collections.emptyList;

@Component
@RequiredArgsConstructor
public class UserDao {

    private final MongoTemplate mongoTemplate;

    private static final String USER_COLLECTION = "USERS";

    public Optional<User> findById(String userId) {
        return Optional.ofNullable(mongoTemplate.findById(userId, User.class, USER_COLLECTION));
    }

    public List<User> getAllStudentsByClassId(List<String> studentIds) {
        if (studentIds == null || studentIds.isEmpty()) {
            return emptyList();
        }

        Query query = new Query(Criteria.where("_id").in(studentIds));
        return mongoTemplate.find(query, User.class, USER_COLLECTION);
    }

}

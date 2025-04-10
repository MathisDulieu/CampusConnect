package com.campus.connect.grade_service.service;

import com.campus.connect.grade_service.UuidProvider;
import com.campus.connect.grade_service.dao.GradeDao;
import com.campus.connect.grade_service.model.Grade;
import com.campus.connect.grade_service.model.User;
import com.campus.connect.grade_service.model.UserRole;
import com.campus.connect.grade_service.model.request.CreateGradeRequest;
import com.campus.connect.grade_service.model.request.UpdateGradeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.Collections.emptyList;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final UuidProvider uuidProvider;
    private final GradeDao gradeDao;

    public List<Grade> getGradesByStudentId(String authenticatedUserId) {
        return gradeDao.findGradesByStudentId(authenticatedUserId);
    }

    public List<Grade> getGradesByStudentIdAndCourseId(String authenticatedUserId, String courseId) {
        return gradeDao.findGradesByStudentIdAndCourseId(authenticatedUserId, courseId);
    }

    public List<Grade> getGradesForStudent(String studentId, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return emptyList();
        }

        return gradeDao.findGradesByStudentId(studentId);
    }

    public ResponseEntity<String> createGrade(CreateGradeRequest request, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can create a grade");
        }

        Grade grade = Grade.builder()
                .id(uuidProvider.generateUuid())
                .gradeValue(request.getGradeValue())
                .comment(request.getComment())
                .semester(request.getSemester())
                .teacherId(authenticatedUser.getId())
                .timestamp(System.currentTimeMillis())
                .courseId(request.getCourseId())
                .studentId(request.getStudentId())
                .build();

        gradeDao.save(grade);

        return ResponseEntity.status(HttpStatus.OK).body("Grade created successfully");
    }

    public ResponseEntity<String> updateGrade(String gradeId, UpdateGradeRequest request, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can update a grade");
        }

        Optional<Grade> optionalGrade = gradeDao.findById(gradeId);
        if (optionalGrade.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grade not found");
        }

        Grade grade = optionalGrade.get();
        if (!grade.getTeacherId().equals(authenticatedUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This grade can only be modified by the professor who assigned it");
        }

        updateGradeRequest(request, grade);

        gradeDao.save(grade);

        return ResponseEntity.status(HttpStatus.OK).body("Grade updated successfully");
    }

    public ResponseEntity<String> deleteGrade(String gradeId, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can delete a grade");
        }

        Optional<Grade> optionalGrade = gradeDao.findById(gradeId);
        if (optionalGrade.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grade not found");
        }

        Grade grade = optionalGrade.get();
        if (!grade.getTeacherId().equals(authenticatedUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This grade can only be deleted by the professor who assigned it");
        }

        gradeDao.delete(grade.getId());

        return ResponseEntity.status(HttpStatus.OK).body("Grade deleted successfully");
    }

    private void updateGradeRequest(UpdateGradeRequest request, Grade grade) {
        if (!isNull(request.getComment())) {
            grade.setComment(request.getComment());
        }

        if (!isNull(request.getGradeValue())) {
            grade.setGradeValue(request.getGradeValue());
        }

        if (!isNull(request.getSemester())) {
            grade.setSemester(request.getSemester());
        }
    }
}

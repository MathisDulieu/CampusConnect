package com.campus.connect.grade_service.controller;

import com.campus.connect.grade_service.model.Grade;
import com.campus.connect.grade_service.model.User;
import com.campus.connect.grade_service.model.request.CreateGradeRequest;
import com.campus.connect.grade_service.model.request.UpdateGradeRequest;
import com.campus.connect.grade_service.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/private/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @GetMapping("/my")
    public List<Grade> getMyGrades(@AuthenticationPrincipal User authenticatedUser) {
        return gradeService.getGradesByStudentId(authenticatedUser.getId());
    }

    @GetMapping("/my/course/{courseId}")
    public List<Grade> getMyGradesForCourse(@PathVariable String courseId, @AuthenticationPrincipal User authenticatedUser) {
        return gradeService.getGradesByStudentIdAndCourseId(authenticatedUser.getId(), courseId);
    }

    @GetMapping("/student/{studentId}")
    public List<Grade> getGradesForStudent(@PathVariable String studentId, @AuthenticationPrincipal User authenticatedUser) {
        return gradeService.getGradesForStudent(studentId, authenticatedUser);
    }

    @PostMapping
    public ResponseEntity<String> createGrade(@RequestBody CreateGradeRequest request, @AuthenticationPrincipal User authenticatedUser) {
        return gradeService.createGrade(request, authenticatedUser);
    }

    @PutMapping("/{gradeId}")
    public ResponseEntity<String> updateGrade(@PathVariable String gradeId, @RequestBody UpdateGradeRequest request, @AuthenticationPrincipal User authenticatedUser) {
        return gradeService.updateGrade(gradeId, request, authenticatedUser);
    }

    @DeleteMapping("/{gradeId}")
    public ResponseEntity<String> deleteGrade(@PathVariable String gradeId, @AuthenticationPrincipal User authenticatedUser) {
        return gradeService.deleteGrade(gradeId, authenticatedUser);
    }
}

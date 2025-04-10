package com.campus.connect.classroom_service.controller;

import com.campus.connect.classroom_service.model.Classroom;
import com.campus.connect.classroom_service.model.User;
import com.campus.connect.classroom_service.model.request.CreateClassRequest;
import com.campus.connect.classroom_service.model.request.UpdateClassRequest;
import com.campus.connect.classroom_service.service.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomService classroomService;

    @GetMapping("/api/classes")
    public List<Classroom> getAllClasses() {
        return classroomService.getAllClasses();
    }

    @GetMapping("/api/classes/sorted")
    public List<Classroom> getClassesSortedByName(@RequestParam(defaultValue = "ASCENDING") SortOrder order) {
        return classroomService.getClassesSortedByName(order);
    }

    @GetMapping("/api/classes/{classId}")
    public ResponseEntity<Classroom> getClassById(@PathVariable String classId) {
        return classroomService.getClassById(classId);
    }

    @PostMapping("/private/classes")
    public ResponseEntity<String> createClass(
            @RequestBody CreateClassRequest request,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return classroomService.createClass(request, authenticatedUser);
    }

    @PutMapping("/private/classes/{classId}")
    public ResponseEntity<String> updateClass(
            @PathVariable String classId,
            @RequestBody UpdateClassRequest request,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return classroomService.updateClass(classId, request, authenticatedUser);
    }

    @DeleteMapping("/private/classes/{classId}")
    public ResponseEntity<String> deleteClass(
            @PathVariable String classId,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return classroomService.deleteClass(classId, authenticatedUser);
    }

    @PostMapping("/private/classes/{classId}/students/{studentId}")
    public ResponseEntity<String> addStudentToClass(
            @PathVariable String classId,
            @PathVariable String studentId,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return classroomService.addStudentToClass(classId, studentId, authenticatedUser);
    }

    @DeleteMapping("/private/classes/{classId}/students/{studentId}")
    public ResponseEntity<String> removeStudentFromClass(
            @PathVariable String classId,
            @PathVariable String studentId,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return classroomService.removeStudentFromClass(classId, studentId, authenticatedUser);
    }

    @GetMapping("/api/classes/{classId}/students")
    public List<User> getStudentsInClass(@PathVariable String classId) {
        return classroomService.getStudentsInClass(classId);
    }
}
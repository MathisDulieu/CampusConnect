package com.campus.connect.classroom_service.service;

import com.campus.connect.classroom_service.UuidProvider;
import com.campus.connect.classroom_service.dao.ClassroomDao;
import com.campus.connect.classroom_service.dao.UserDao;
import com.campus.connect.classroom_service.model.Classroom;
import com.campus.connect.classroom_service.model.User;
import com.campus.connect.classroom_service.model.UserRole;
import com.campus.connect.classroom_service.model.request.CreateClassRequest;
import com.campus.connect.classroom_service.model.request.UpdateClassRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.List;
import java.util.Optional;

import static java.util.Collections.emptyList;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final UserDao userDao;
    private final UuidProvider uuidProvider;
    private final ClassroomDao classroomDao;

    public List<Classroom> getAllClasses() {
        return classroomDao.findAllClasses();
    }

    public List<Classroom> getClassesSortedByName(SortOrder order) {
        return classroomDao.findAllClassesByName(order);
    }

    public ResponseEntity<Classroom> getClassById(String classId) {
        Optional<Classroom> optionalClassroom = classroomDao.findById(classId);
        return optionalClassroom.map(classroom -> ResponseEntity.status(HttpStatus.OK).body(classroom)).orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(Classroom.builder().build()));
    }

    public ResponseEntity<String> createClass(CreateClassRequest request, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can create a class");
        }

        Classroom classroom = Classroom.builder()
                .id(uuidProvider.generateUuid())
                .name(request.getName())
                .professorId(authenticatedUser.getId())
                .courseIds(request.getCourseIds())
                .description(request.getDescription())
                .studentIds(emptyList())
                .build();

        classroomDao.save(classroom);

        return ResponseEntity.status(HttpStatus.OK).body("Class created successfully");
    }

    public ResponseEntity<String> updateClass(String classId, UpdateClassRequest request, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can update a class");
        }

        Optional<Classroom> optionalClassroom = classroomDao.findById(classId);
        if (optionalClassroom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
        }

        Classroom classroom = optionalClassroom.get();

        updateClassRequest(request, classroom);

        classroomDao.save(classroom);

        return ResponseEntity.status(HttpStatus.OK).body("Class updated successfully");
    }

    public ResponseEntity<String> deleteClass(String classId, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can update a class");
        }

        Optional<Classroom> optionalClassroom = classroomDao.findById(classId);
        if (optionalClassroom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
        }

        if (!optionalClassroom.get().getStudentIds().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot delete class with enrolled students");
        }

        classroomDao.delete(classId);

        return ResponseEntity.status(HttpStatus.OK).body("Class deleted successfully");
    }

    public ResponseEntity<String> addStudentToClass(String classId, String studentId, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can add a student to a class");
        }

        Optional<Classroom> optionalClassroom = classroomDao.findById(classId);
        if (optionalClassroom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
        }

        Classroom classroom = optionalClassroom.get();

        List<String> studentIds = classroom.getStudentIds();
        if (!studentIds.contains(studentId)) {
            studentIds.add(studentId);
            classroomDao.save(classroom);
            return ResponseEntity.status(HttpStatus.OK).body("Student added successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student is already in the class");
        }
    }

    public ResponseEntity<String> removeStudentFromClass(String classId, String studentId, User authenticatedUser) {
        if (!authenticatedUser.getRole().equals(UserRole.PROFESSOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only a professor can remove a student from a class");
        }

        Optional<Classroom> optionalClassroom = classroomDao.findById(classId);
        if (optionalClassroom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found");
        }

        Classroom classroom = optionalClassroom.get();

        List<String> studentIds = classroom.getStudentIds();
        if (studentIds.contains(studentId)) {
            studentIds.remove(studentId);
            classroomDao.save(classroom);
            return ResponseEntity.status(HttpStatus.OK).body("Student removed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student is not in the class");
        }
    }

    public List<User> getStudentsInClass(String classId) {
        Optional<Classroom> optionalClassroom = classroomDao.findById(classId);
        if (optionalClassroom.isEmpty()) {
            return emptyList();
        }

        Classroom classroom = optionalClassroom.get();

        return userDao.getAllStudentsByClassId(classroom.getStudentIds());
    }

    private void updateClassRequest(UpdateClassRequest request, Classroom classroom) {
        if (!isNull(request.getName())) {
            classroom.setName(request.getName());
        }

        if (!isNull(request.getDescription())) {
            classroom.setDescription(request.getDescription());
        }

        if (!request.getCourseIds().isEmpty()) {
            classroom.setCourseIds(request.getCourseIds());
        }
    }
}

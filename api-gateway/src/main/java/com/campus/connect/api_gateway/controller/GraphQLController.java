package com.campus.connect.api_gateway.controller;

import com.campus.connect.api_gateway.config.EnvConfiguration;
import com.campus.connect.api_gateway.model.Classroom;
import com.campus.connect.api_gateway.model.Grade;
import com.campus.connect.api_gateway.model.User;
import com.campus.connect.api_gateway.model.request.AuthenticationService.LoginRequest;
import com.campus.connect.api_gateway.model.request.AuthenticationService.RegisterRequest;
import com.campus.connect.api_gateway.model.request.ClassroomService.CreateClassRequest;
import com.campus.connect.api_gateway.model.request.ClassroomService.UpdateClassRequest;
import com.campus.connect.api_gateway.model.request.GradeService.CreateGradeRequest;
import com.campus.connect.api_gateway.model.request.GradeService.UpdateGradeRequest;
import com.campus.connect.api_gateway.model.request.UserService.UpdateUserDetailsRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
public class GraphQLController {

    private final WebClient.Builder webClientBuilder;
    private final EnvConfiguration envConfiguration;

    @QueryMapping
    public User me(@ContextValue HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .post()
                .uri(envConfiguration.getUserServiceUrl() + "/private/user/me")
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(User.class)
                .block();
    }

    @MutationMapping
    public String login(@Argument String email, @Argument String password) {
        return webClientBuilder.build()
                .post()
                .uri(envConfiguration.getAuthServiceUrl() + "/api/auth/login")
                .bodyValue(new LoginRequest(email, password))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @MutationMapping
    public String register(@Argument String email, @Argument String username, @Argument String password, @Argument String role) {
        return webClientBuilder.build()
                .post()
                .uri(envConfiguration.getAuthServiceUrl() + "/api/auth/register")
                .bodyValue(new RegisterRequest(email, username, password, role))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @MutationMapping
    public String updateUser(
            @Argument String username,
            @Argument String email,
            @Argument String oldPassword,
            @Argument String newPassword,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .put()
                .uri(envConfiguration.getUserServiceUrl() + "/private/user")
                .header("Authorization", authorizationHeader)
                .bodyValue(new UpdateUserDetailsRequest(email, username, oldPassword, newPassword))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @MutationMapping
    public String deleteUser(@ContextValue HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .delete()
                .uri(envConfiguration.getUserServiceUrl() + "/private/user")
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @QueryMapping
    public List<Classroom> classes() {
        return webClientBuilder.build()
                .get()
                .uri(envConfiguration.getClassroomServiceUrl() + "/api/classes")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Classroom>>() {})
                .block();
    }

    @QueryMapping
    public List<Classroom> classesSorted(@Argument String order) {
        return webClientBuilder.build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("http")
                        .host("classroom-service")
                        .port(8083)
                        .path("/api/classes/sorted")
                        .queryParam("order", order)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Classroom>>() {})
                .block();
    }

    @QueryMapping
    public Classroom classById(@Argument String id) {
        return webClientBuilder.build()
                .get()
                .uri(envConfiguration.getClassroomServiceUrl() + "/api/classes/" + id)
                .retrieve()
                .bodyToMono(Classroom.class)
                .block();
    }

    @QueryMapping
    public List<User> studentsInClass(@Argument String classId) {
        return webClientBuilder.build()
                .get()
                .uri(envConfiguration.getClassroomServiceUrl() + "/api/classes/" + classId + "/students")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<User>>() {})
                .block();
    }

    @MutationMapping
    public String createClass(
            @Argument String name,
            @Argument String description,
            @Argument List<String> courseIds,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .post()
                .uri(envConfiguration.getClassroomServiceUrl() + "/private/classes")
                .header("Authorization", authorizationHeader)
                .bodyValue(new CreateClassRequest(name, description, courseIds))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }


    @MutationMapping
    public String updateClass(
            @Argument String id,
            @Argument String name,
            @Argument String description,
            @Argument List<String> courseIds,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .put()
                .uri(envConfiguration.getClassroomServiceUrl() + "/private/classes/" + id)
                .header("Authorization", authorizationHeader)
                .bodyValue(new UpdateClassRequest(name, description, courseIds))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }


    @MutationMapping
    public String deleteClass(
            @Argument String id,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .delete()
                .uri(envConfiguration.getClassroomServiceUrl() + "/private/classes/" + id)
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @MutationMapping
    public String addStudentToClass(
            @Argument String classId,
            @Argument String studentId,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .post()
                .uri(envConfiguration.getClassroomServiceUrl() + "/private/classes/" + classId + "/students/" + studentId)
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @MutationMapping
    public String removeStudentFromClass(
            @Argument String classId,
            @Argument String studentId,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .delete()
                .uri(envConfiguration.getClassroomServiceUrl() + "/private/classes/" + classId + "/students/" + studentId)
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @QueryMapping
    public List<Grade> myGrades(@ContextValue HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .get()
                .uri(envConfiguration.getGradeServiceUrl() + "/private/grades/my")
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Grade>>() {})
                .block();
    }

    @QueryMapping
    public List<Grade> myGradesForCourse(@Argument String courseId, @ContextValue HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .get()
                .uri(envConfiguration.getGradeServiceUrl() + "/private/grades/my/course/" + courseId)
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Grade>>() {})
                .block();
    }

    @QueryMapping
    public List<Grade> gradesForStudent(@Argument String studentId, @ContextValue HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .get()
                .uri(envConfiguration.getGradeServiceUrl() + "/private/grades/student/" + studentId)
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Grade>>() {})
                .block();
    }

    @MutationMapping
    public String createGrade(
            @Argument String studentId,
            @Argument String courseId,
            @Argument Double gradeValue,
            @Argument String comment,
            @Argument String semester,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .post()
                .uri(envConfiguration.getGradeServiceUrl() + "/private/grades")
                .header("Authorization", authorizationHeader)
                .bodyValue(new CreateGradeRequest(studentId, courseId, gradeValue, comment, semester))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @MutationMapping
    public String updateGrade(
            @Argument String gradeId,
            @Argument Double gradeValue,
            @Argument String comment,
            @Argument String semester,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .put()
                .uri(envConfiguration.getGradeServiceUrl() + "/private/grades/" + gradeId)
                .header("Authorization", authorizationHeader)
                .bodyValue(new UpdateGradeRequest(gradeValue, comment, semester))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @MutationMapping
    public String deleteGrade(
            @Argument String gradeId,
            @ContextValue HttpServletRequest request
    ) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null) {
            throw new RuntimeException("Authentication required");
        }

        return webClientBuilder.build()
                .delete()
                .uri(envConfiguration.getGradeServiceUrl() + "/private/grades/" + gradeId)
                .header("Authorization", authorizationHeader)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

}
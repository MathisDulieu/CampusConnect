package com.campus.connect.grade_service.model;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@Builder
public class Grade {

    @Id
    private String id;
    private String studentId;
    private String courseId;
    private Double gradeValue;
    private String comment;
    private String teacherId;
    private String semester;
    private Long timestamp;

}

package com.campus.connect.api_gateway.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
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
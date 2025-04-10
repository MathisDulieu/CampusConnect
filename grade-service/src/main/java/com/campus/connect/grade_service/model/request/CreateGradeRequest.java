package com.campus.connect.grade_service.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateGradeRequest {

    private String studentId;
    private String courseId;
    private Double gradeValue;
    private String comment;
    private String semester;

}

package com.campus.connect.api_gateway.model.request.GradeService;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGradeRequest {
    private Double gradeValue;
    private String comment;
    private String semester;
}
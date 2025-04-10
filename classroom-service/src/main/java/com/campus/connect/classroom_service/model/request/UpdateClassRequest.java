package com.campus.connect.classroom_service.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateClassRequest {
    private String name;
    private String description;
    private List<String> courseIds;
}

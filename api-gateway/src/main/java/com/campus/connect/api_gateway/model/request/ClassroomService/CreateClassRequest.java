package com.campus.connect.api_gateway.model.request.ClassroomService;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateClassRequest {
    private String name;
    private String description;
    private List<String> courseIds;
}
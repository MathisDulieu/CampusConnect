package com.campus.connect.api_gateway.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@Setter
@Builder
public class Classroom {

    @Id
    private String id;
    private String description;
    private String name;
    private String professorId;
    private List<String> studentIds;
    private List<String> courseIds;

}
package com.campus.connect.api_gateway.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@Builder
public class User {

    @Id
    private String id;
    private String email;
    private String username;
    private UserRole role;

}

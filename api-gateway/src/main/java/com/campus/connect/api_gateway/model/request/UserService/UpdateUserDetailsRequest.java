package com.campus.connect.api_gateway.model.request.UserService;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDetailsRequest {
    private String email;
    private String username;
    private String oldPassword;
    private String newPassword;
}
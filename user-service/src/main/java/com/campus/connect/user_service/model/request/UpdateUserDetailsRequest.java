package com.campus.connect.user_service.model.request;

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

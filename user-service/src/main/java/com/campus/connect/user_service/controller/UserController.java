package com.campus.connect.user_service.controller;

import com.campus.connect.user_service.model.User;
import com.campus.connect.user_service.model.request.UpdateUserDetailsRequest;
import com.campus.connect.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/private/user/me")
    public User getAuthenticatedUserDetails(
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return authenticatedUser;
    }

    @PutMapping("/private/user")
    public ResponseEntity<String> updateUser(
            @RequestBody UpdateUserDetailsRequest request,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return userService.updateUser(request, authenticatedUser);
    }

    @DeleteMapping("/private/user")
    public ResponseEntity<String> deleteUser(
            @AuthenticationPrincipal User authenticatedUser
    ) {
        return userService.deleteUser(authenticatedUser);
    }

}

package com.campus.connect.user_service.service;

import com.campus.connect.user_service.dao.UserDao;
import com.campus.connect.user_service.model.User;
import com.campus.connect.user_service.model.request.UpdateUserDetailsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}';:\",.<>?|`~])[A-Za-z\\d!@#$%^&*()_+\\-={}';:\",.<>?|`~]{8,}$";

    public ResponseEntity<String> updateUser(UpdateUserDetailsRequest request, User authenticatedUser) {
        List<String> errors = new ArrayList<>();

        validateUpdateAuthenticatedUserDetailsRequest(errors, request);
        if (errors.isEmpty()) {
            validateNewUsername(errors, request.getUsername(), authenticatedUser);
            validateNewEmail(errors, request.getEmail(), authenticatedUser);
            validateNewPassword(errors, request.getOldPassword(), request.getNewPassword(), authenticatedUser);
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getErrorsAsString(errors));
        }

        userDao.save(authenticatedUser);

        return ResponseEntity.status(HttpStatus.OK).body("User updated successfully");
    }

    public ResponseEntity<String> deleteUser(User authenticatedUser) {
        userDao.delete(authenticatedUser.getId());

        return ResponseEntity.status(HttpStatus.OK).body("User deleted successfully");
    }

    private void validateUpdateAuthenticatedUserDetailsRequest(List<String> errors, UpdateUserDetailsRequest request) {
        if (isNull(request.getEmail()) && isNull(request.getUsername()) && isNull(request.getNewPassword())) {
            errors.add("At least one field (email, username, or password) must be provided to update your profile. Please specify what you want to change.");
        }
    }

    private void validateNewUsername(List<String> errors, String username, User userToUpdate) {
        if (!isNull(username)) {
            if (isInvalidUsername(username)) {
                errors.add("Invalid username format. Username must be between 3-20 characters and contain only letters, numbers, and underscores.");
            }

            if (userDao.isUsernameAlreadyUsed(username)) {
                errors.add("This username is already taken. Please choose a different username.");
            }

            if (username.equals(userToUpdate.getUsername())) {
                errors.add("The new username is the same as your current username. Please enter a different username to make a change.");
            }

            userToUpdate.setUsername(username);
        }
    }

    private void validateNewEmail(List<String> errors, String email, User userToUpdate) {
        if (!isNull(email)) {
            if (isInvalidEmail(email)) {
                errors.add("Invalid email format. Please enter a valid email address.");
            }

            if (userDao.isEmailAlreadyUsed(email)) {
                errors.add("This email address is already registered with another account. Please use a different email address.");
            }

            if (email.equals(userToUpdate.getEmail())) {
                errors.add("The new email is the same as your current email. Please enter a different email address to make a change.");
            }

            userToUpdate.setEmail(email);
        }
    }

    private void validateNewPassword(List<String> errors, String oldPassword, String newPassword, User userToUpdate) {
        if (!isNull(oldPassword) || !isNull(newPassword)) {
            if (isInvalidPassword(newPassword)) {
                errors.add("Password does not meet security requirements. Please use at least 8 characters including" +
                        " uppercase, lowercase, numbers, and special characters.");
            }

            if (passwordEncoder.matches(newPassword, userToUpdate.getPassword())) {
                errors.add("The new password cannot be the same as your current password. Please choose a different password.");
            }

            if (!passwordEncoder.matches(oldPassword, userToUpdate.getPassword())) {
                errors.add("Incorrect current password. Please enter your current password correctly to verify your identity.");
            }

            userToUpdate.setPassword(passwordEncoder.encode(newPassword));
        }
    }

    private boolean isInvalidEmail(String email) {
        return isNull(email) || !Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }

    private boolean isInvalidUsername(String username) {
        return isNull(username) || username.length() < 3 || username.length() > 11 || username.contains(" ");
    }

    private boolean isInvalidPassword(String password) {
        return isNull(password) || !password.matches(PASSWORD_REGEX);
    }

    public String getErrorsAsString(List<String> errors) {
        return String.join(" | ", errors);
    }
}

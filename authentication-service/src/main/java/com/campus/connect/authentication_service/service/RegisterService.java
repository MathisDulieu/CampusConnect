package com.campus.connect.authentication_service.service;

import com.campus.connect.authentication_service.UuidProvider;
import com.campus.connect.authentication_service.dao.UserDao;
import com.campus.connect.authentication_service.model.User;
import com.campus.connect.authentication_service.model.UserRole;
import com.campus.connect.authentication_service.model.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UuidProvider uuidProvider;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}';:\",.<>?|`~])[A-Za-z\\d!@#$%^&*()_+\\-={}';:\",.<>?|`~]{8,}$";

    public ResponseEntity<String> registerUser(RegisterRequest request) {
        User user = buildUser(request);

        String error = getValidationError(user);
        if (!isNull(error)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.save(user);

        return ResponseEntity.status(HttpStatus.OK).body("User successfully registered");
    }

    private User buildUser(RegisterRequest request) {
        return User.builder()
                .id(uuidProvider.generateUuid())
                .password(request.getPassword())
                .email(request.getEmail())
                .username(request.getUsername())
                .role(UserRole.valueOf(request.getRole()))
                .build();
    }

    private String getValidationError(User user) {
        if (isInvalidEmail(user.getEmail())) {
            return "The provided email is not valid.";
        }
        if (isInvalidUsername(user.getUsername())) {
            return "The username must be between 3 and 11 characters long and must not contain spaces.";
        }
        if (isInvalidPassword(user.getPassword())) {
            return "The password does not meet the required criteria.";
        }
        if (userDao.isEmailAlreadyUsed(user.getEmail())) {
            return "A user with this email already exists.";
        }
        if (userDao.isUsernameAlreadyUsed(user.getUsername())) {
            return "A user with this username already exists.";
        }

        return null;
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

}

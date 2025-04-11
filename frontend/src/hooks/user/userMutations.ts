import { gql, useMutation } from '@apollo/client';

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($username: String, $email: String, $oldPassword: String, $newPassword: String) {
        updateUser(username: $username, email: $email, oldPassword: $oldPassword, newPassword: $newPassword)
    }
`;

export const DELETE_USER_MUTATION = gql`
    mutation DeleteUser {
        deleteUser
    }
`;

export const useUpdateUser = () => {
    return useMutation(UPDATE_USER_MUTATION);
};

export const useDeleteUser = () => {
    return useMutation(DELETE_USER_MUTATION);
};
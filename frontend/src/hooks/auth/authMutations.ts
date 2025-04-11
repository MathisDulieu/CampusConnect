import { gql, useMutation } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $username: String!, $password: String!, $role: String!) {
        register(email: $email, username: $username, password: $password, role: $role)
    }
`;

export const useLogin = () => {
    return useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            if (data.login) {
                localStorage.setItem('authToken', data.login);
            }
        }
    });
};

export const useRegister = () => {
    return useMutation(REGISTER_MUTATION);
};
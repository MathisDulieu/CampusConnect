import { gql, useQuery } from '@apollo/client';
import { User } from '../type.ts';

export const GET_ME_QUERY = gql`
    query GetMe {
        me {
            id
            email
            username
            role
        }
    }
`;

export const useGetMe = () => {
    return useQuery<{ me: User }>(GET_ME_QUERY);
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../../hooks/user/userQueries';
import { useUpdateUser, useDeleteUser } from '../../hooks/user/userMutations';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { data, loading: loadingUser, error: userError, refetch } = useGetMe();
    const [updateUser, { loading: updatingUser }] = useUpdateUser();
    const [deleteUser, { loading: deletingUser }] = useDeleteUser();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (data?.me) {
            setUsername(data.me.username);
            setEmail(data.me.email);
        }
    }, [data]);

    useEffect(() => {
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword && newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const { data } = await updateUser({
                variables: {
                    username,
                    email,
                    oldPassword: oldPassword || null,
                    newPassword: newPassword || null
                }
            });

            if (data?.updateUser) {
                setMessage('Profile updated successfully');
                refetch();

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError('Failed to update profile');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while updating profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const { data } = await deleteUser();

                if (data?.deleteUser) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                } else {
                    setError('Failed to delete account');
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred while deleting account');
            }
        }
    };

    if (loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading profile...</div>
            </div>
        );
    }

    if (userError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {userError.message}
                </div>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => navigate('/home')}
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Profile</h1>
                        <button
                            onClick={() => navigate('/home')}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="oldPassword">
                                Current Password (required for password change)
                            </label>
                            <input
                                id="oldPassword"
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                                New Password (leave blank to keep current)
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                disabled={updatingUser}
                            >
                                {updatingUser ? 'Updating...' : 'Update Profile'}
                            </button>

                            <button
                                type="button"
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-red-300"
                                onClick={handleDeleteAccount}
                                disabled={deletingUser}
                            >
                                {deletingUser ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
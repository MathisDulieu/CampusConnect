import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGetMe} from '../../hooks/user/userQueries';
import {useGetClasses} from '../../hooks/class/classQueries';
import {useGetMyGrades, useGetMyGradesForCourse} from '../../hooks/grade/gradeQueries';
import {Role} from '../../hooks/type.ts';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState<string>('');

    const {data: userData, loading: loadingUser, error: userError} = useGetMe();

    const {data: classesData, loading: loadingClasses, error: classesError} = useGetClasses();

    const {data: allGradesData, loading: loadingAllGrades, error: allGradesError} = useGetMyGrades();

    const {
        data: courseGradesData,
        loading: loadingCourseGrades,
        error: courseGradesError,
        refetch: refetchCourseGrades
    } =
        useGetMyGradesForCourse(selectedCourse);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        if (userData?.me && userData.me.role !== Role.STUDENT) {
            navigate('/professor-dashboard');
        }
    }, [userData, navigate]);

    useEffect(() => {
        if (selectedCourse) {
            refetchCourseGrades();
        }
    }, [selectedCourse, refetchCourseGrades]);

    if (loadingUser || loadingClasses || loadingAllGrades) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    if (userError || classesError || allGradesError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {userError?.message || classesError?.message || allGradesError?.message}
                </div>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    }}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">My Classes</h2>
                            {classesData?.classes && classesData.classes.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {classesData.classes.map((classroom) => (
                                        <li key={classroom.id} className="py-3">
                                            <div className="font-medium">{classroom.name}</div>
                                            {classroom.description && (
                                                <div className="text-sm text-gray-500">{classroom.description}</div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">You are not enrolled in any classes.</p>
                            )}
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">All My Grades</h2>
                            {allGradesData?.myGrades && allGradesData.myGrades.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {allGradesData.myGrades.map((grade) => (
                                        <li key={grade.id} className="py-3">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Course ID: {grade.courseId}</span>
                                                <span className={`font-bold ${
                                                    grade.gradeValue >= 16 ? 'text-green-600' :
                                                        grade.gradeValue >= 10 ? 'text-blue-600' : 'text-red-600'
                                                }`}>
                                                  {grade.gradeValue.toFixed(1)}/20
                                                </span>
                                            </div>
                                            {grade.comment && (
                                                <div className="text-sm text-gray-500 mt-1">{grade.comment}</div>
                                            )}
                                            <div className="text-xs text-gray-400 mt-1">
                                                Semester: {grade.semester} |
                                                Date: {new Date(grade.timestamp).toLocaleDateString()}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">You don't have any grades yet.</p>
                            )}
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Grades by Course</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="courseSelect">
                                    Select Course
                                </label>
                                <select
                                    id="courseSelect"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">Select a course</option>
                                    {classesData?.classes && classesData.classes.flatMap(classroom =>
                                        classroom.courseIds ? classroom.courseIds.map(courseId => (
                                            <option key={courseId} value={courseId}>
                                                {courseId}
                                            </option>
                                        )) : []
                                    )}
                                </select>
                            </div>

                            {selectedCourse ? (
                                loadingCourseGrades ? (
                                    <p className="text-gray-500">Loading grades...</p>
                                ) : courseGradesError ? (
                                    <p className="text-red-500">Error loading grades: {courseGradesError.message}</p>
                                ) : courseGradesData?.myGradesForCourse && courseGradesData.myGradesForCourse.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {courseGradesData.myGradesForCourse.map((grade) => (
                                            <li key={grade.id} className="py-3">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Grade</span>
                                                    <span className={`font-bold ${
                                                        grade.gradeValue >= 16 ? 'text-green-600' :
                                                            grade.gradeValue >= 10 ? 'text-blue-600' : 'text-red-600'
                                                    }`}>
                                                        {grade.gradeValue.toFixed(1)}/20
                                                    </span>
                                                </div>
                                                {grade.comment && (
                                                    <div className="text-sm text-gray-500 mt-1">{grade.comment}</div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Semester: {grade.semester} |
                                                    Date: {new Date(grade.timestamp).toLocaleDateString()}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No grades found for this course.</p>
                                )
                            ) : (
                                <p className="text-gray-500">Please select a course to view specific grades.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
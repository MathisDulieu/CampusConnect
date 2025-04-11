import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Header from "./component/structure/Header";
import Footer from "./component/structure/Footer";

import PrivateRoute from "./service/PrivateRoute";
import {AuthProvider} from "./service/AuthContext";

import NotFound from "./pages/common/NotFound.tsx"
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/common/Home";
import Profile from "./pages/common/Profile";

import StudentDashboard from "./pages/student/Dashboard";
import ProfessorDashboard from "./pages/professor/Dashboard";
import React from "react";


function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-grow min-h-screen">
                    <Header/>
                    <div className="flex-grow p-4">
                        <Routes>
                            <Route path="/home" element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>

                            <Route element={<PrivateRoute/>}>
                                <Route path="/profile" element={<Profile/>}/>
                            </Route>

                            <Route element={<PrivateRoute requiredRole="student"/>}>
                                <Route path="/student-dashboard" element={<StudentDashboard/>}/>
                            </Route>

                            <Route element={<PrivateRoute requiredRole="professor"/>}>
                                <Route path="/professor-dashboard" element={<ProfessorDashboard/>}/>
                            </Route>

                            <Route path="*" element={<NotFound/>}/>

                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
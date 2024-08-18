import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../../styles/Dashboard.css'
import RegisterDoctor from './adminModules/RegisterDoctor';
import defaultImg from '../../images/default.jpg';

export default function AdminDashboard() {  

    const [admin, setAdmin] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [activeComponent,setActiveComponent] = useState(false);
    const baseUrl = 'http://localhost:7070/health/admin';
    const navigate = useNavigate();
    const { setAuthState } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthState({ isAuthenticated: false, admin: null});
        navigate('/login');
    }

    useEffect(() => {
        const fetchPatientDetails = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(baseUrl,{
                headers: { Authorization: `Bearer ${token}`},
            });
            setAdmin(response.data);

            if(response.data.profilepic){
                const imageUrl = `data:image/png;base64,${response.data.profilepic}`;
                setProfileImage(imageUrl);
            }
        };

        fetchPatientDetails();
    },[]);

    const handleShowRegisterDoctor = () => {
        setActiveComponent(activeComponent === 'registerDoctor' ? null : 'registerDoctor');
    }


    if(!admin) return <div>Loading.....</div>

  return (
    <div className='admin-dashboard'>
        <div className='profile'>
            <img src = {profileImage || defaultImg} alt={admin.name} className='profileImg' />
            <div className='content'>
                <h2>Hi, {admin.name}</h2>
            </div>
            <hr/>
            <br />
            <button className='register' onClick={handleShowRegisterDoctor}>Doctor Registration</button>
            <br/>
            <button onClick={handleLogout} className='logout'>Logout</button>
        </div>
        {activeComponent === 'registerDoctor' && (
            <div className='admin-container'>
                <RegisterDoctor />
            </div>
        )}
    </div>
  );
};






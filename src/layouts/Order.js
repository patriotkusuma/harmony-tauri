import axios from 'axios';

import AdminNavbar from 'components/Navbars/AuthNavbar';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Order = ({children}) => {
      useEffect(() => {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}, []);

    const mainContent = useRef();
        
    const [authenticated, setAuthenticated] = useState(localStorage.getItem("token")||null);
    const [auth, setAuth] = useState(localStorage.getItem('user') || null);

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authenticated}`,
    };
    const navigate = useNavigate();

    
  const checkUser = async () => {
        await axios.get('/user', {headers})
        .then((res) => setAuth(res.data))
        .catch((err)=>{
            console.log(err)
            localStorage.removeItem("token");
            // navigate('/auth/login');
        })
    }

    useEffect(()=>{
    // if(auth === null){
    // checkUser();
    // }

    // if(authenticated == null){
    //     navigate('/auth/login')
    // }
    },[authenticated, auth]);

  return (
    <>
        <div className='main-content bg-gradient-info ' ref={mainContent}>
            <AdminNavbar />

            <div className='header bg-gradient-info py-7 py-lg'></div>

            <div className='mt--7 mx-5 pb--5 min-vh-100'>
                {children}
            </div>

        </div>
    </>
  )
}

export default Order
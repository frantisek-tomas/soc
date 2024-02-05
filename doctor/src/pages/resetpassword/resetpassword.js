import './resetpassword.css';
import React, { useState } from 'react';

const ResetPassword = () => {

    const [newpasd, setNewpasd] = useState('');
    const [repeatpasd, setRepeatpasd] = useState('');
  
    const handleLogin = (e) => {
      e.preventDefault();
      console.log(`newpasd: ${newpasd}, repeatpasd: ${repeatpasd}`);
    };

    return(
        <>
        <div className="resetpassword-background">
            <form onSubmit={handleLogin}>
            <div className='resetpassword-header'>Vytvorte si nove heslo</div>
            <div className='login-email'>Nove heslo</div>
            <input 
                className='email-input'
                value={newpasd}
                onChange={(e) => setNewpasd(e.target.value)}
            ></input>
            <div className='login-password'>Zopakujte nove heslo</div>
            <input 
                className='password-input'
                type="password"
                value={repeatpasd}
                onChange={(e) => setRepeatpasd(e.target.value)}
            ></input>
            <button className='resetpassword-button'>vytvorit nove heslo</button>
            </form>
        </div>
        </>
    )
}

export default ResetPassword
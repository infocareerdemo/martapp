import React from 'react';
import './AuthButtons.css';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
    const navigate = useNavigate();

    const onSignIn = () => {
        navigate('/Login')
    }

    const onSignUp = () => {
        navigate('/Register')
    }

    return (
        <div className="auth-buttons-container">
            <button className="btn-signin" onClick={onSignIn}>Sign In</button>
            <button className="btn-signup" onClick={onSignUp}>Sign Up</button>
        </div>
    );
};

export default AuthButtons;
import React, { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Login.css';
import { Routes } from '../Router';
import useStore from '../../hooks/useStore';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const { userStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      userStore.login(user);
      navigate(Routes.dashboard);
    }
  }, [user, loading, userStore, navigate]);

  return (
    <div className="login">
      <div className="login__container">
        <input type="text" className="login__textBox" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail Address" />
        <input type="password" className="login__textBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="login__btn" onClick={() => logInWithEmailAndPassword(email, password)}>
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
};
export default Login;

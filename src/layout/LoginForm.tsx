import Field from '../components/Home/Field';
import React, { useState } from 'react';
import FormData from 'form-data';
import Link from 'next/link';
import { LoginData } from '../types/login';
import { useDispatch } from 'react-redux';
import { setLoginData, setUserData } from '../redux/userSlice';
import { useRouter } from 'next/router';
import apiClient from '../utils/client';

function LoginForm() {
  const initialValues: LoginData = {
    email: '',
    password: ''
  };
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<LoginData>(initialValues);
  const data = new FormData();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = () => {
    // resetForm();
    data.append('email', formData.email);
    data.append('password', formData.password);

    apiClient
      .post('login', data)
      .then((res) => {
        let user = { userId: res.data.userId, authToken: res.data.token };
        localStorage.setItem('token', user.authToken);
        localStorage.setItem('userId', user.userId);
        dispatch(setLoginData(user));
        router.push('/chat');
      })
      .then((err) => {
        console.log(err);
      });
    /* 
      TODO: 
      1. Check login
      2. Handle errors (if there is at least one) 
    */
  };

  const resetForm = () => {
    // data.delete('email');
    // data.delete('password');
  };

  return (
    <div
      id="login"
      className="right-side d-flex flex-column justify-content-center w-50 bg-chatter-green h-100 py-5 fs-1 fw-bold"
    >
      <Field
        title="E-MAIL"
        type="email"
        name="email"
        placeholder="Ingresa tu correo electrónico"
        onChange={handleInputChange}
      />

      <Field
        title="CONTRASEÑA"
        type="password"
        name="password"
        placeholder="Ingresa tu contraseña"
        onChange={handleInputChange}
      />

      <div className="content d-flex flex-column mb-5 d-flex align-items-start" data-aos="fade">
        <button type="submit" className="btn btn-primary" onClick={handleLogin}>
          Ingresar
        </button>
      </div>

      <div className="content text d-flex flex-row gap-2 mb-5 fs-6 fst-italic" data-aos="fade">
        <span>No tienes una cuenta?</span>
        <Link href="/register" className="text-chatter-blue">
          Registrate aquí
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;

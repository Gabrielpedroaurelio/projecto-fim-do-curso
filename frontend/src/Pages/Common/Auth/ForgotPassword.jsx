import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import style from './AuthCommon.module.css';
import favicon from '../../../assets/images/favicon.ico';
import background from '../../../assets/images/img-login.jpg';
import { FaChevronLeft, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { forgotPassword } = useAuth();
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        
        const result = await forgotPassword(data.email);
        
        if (result.success) {
            setStatus({ type: 'success', message: result.message });
        } else {
            setStatus({ type: 'error', message: result.message });
        }
        setIsSubmitting(false);
    };

    return (
        <div className={style.containerForm}>
            <div className={style.cardForm}>
                <div className={style.form}>
                    <div className={style.infos}>
                        <div className={style.logo}>
                            <img src={favicon} alt="Logo" width={30} />
                            <span>IPM</span>
                        </div>
                        <div className={style.mensage}>
                            <h1>Recuperar <br /> A Sua Senha</h1>
                            <p>Introduza o seu e-mail para receber as instruções.</p>
                            <small>Oi, vamos ajudar-te a recuperar o acesso à tua conta.</small>
                        </div>
                    </div>

                    <div className={style.backLink}>
                        <Link to="/student/auth">
                            <FaChevronLeft /> Voltar ao Login
                        </Link>
                    </div>

                    {status.type === 'success' ? (
                        <div className={style.successContainer}>
                            <FaCheckCircle className={style.successIcon} />
                            <div className={style.mensage}>
                                <h1>E-mail Enviado!</h1>
                                <p>{status.message}</p>
                            </div>
                            <Link to="/student/auth" className={style.primaryBtn} style={{marginTop: '20px'}}>Sair</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={style.inputGroup}>
                                <input 
                                    type="email" 
                                    placeholder='Seu E-mail Institucional'
                                    {...register("email", { 
                                        required: "O e-mail é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "E-mail inválido"
                                        }
                                    })} 
                                />
                                {errors.email && <span className={style.errorMsg}>{errors.email.message}</span>}
                            </div>

                            {status.type === 'error' && (
                                <div className={style.errorBanner}>
                                    {status.message}
                                </div>
                            )}

                            <div className={style.inputGroup}>
                                <button 
                                    type='submit' 
                                    disabled={isSubmitting} 
                                    className={style.primaryBtn}
                                >
                                    {isSubmitting ? 'A enviar...' : (
                                        <>
                                            Enviar <FaPaperPlane />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className={style.background}>
                    <img src={background} alt="Background" />
                </div>
            </div>
        </div>
    );
}

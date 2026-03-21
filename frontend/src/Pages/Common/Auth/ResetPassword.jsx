import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import style from './AuthCommon.module.css';
import favicon from '../../../assets/images/favicon.ico';
import background from '../../../assets/images/img-login.jpg';
import { FaPaperPlane, FaCheckCircle, FaLock, FaKey } from 'react-icons/fa';

export default function ResetPassword() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { resetPassword } = useAuth();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = searchParams.get('token');

    const onSubmit = async (data) => {
        if (!token) {
            setStatus({ type: 'error', message: 'Token de recuperação não encontrado. Por favor, solicite um novo link.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        
        const result = await resetPassword(token, data.password);
        
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
                            <h1>Nova <br /> Palavra-Passe</h1>
                            <p>Crie uma senha forte e segura.</p>
                            <small>Siga as instruções para reativar o seu acesso.</small>
                        </div>
                    </div>

                    {!token && status.type !== 'success' ? (
                        <div className={style.errorBanner} style={{marginTop: '30px'}}>
                            Link inválido ou expirado. Por favor peça um novo.
                            <Link to="/auth/forgot-password" style={{display: 'block', marginTop: '10px', color: '#dc3545'}}>Pedir Novo Link</Link>
                        </div>
                    ) : status.type === 'success' ? (
                        <div className={style.successContainer}>
                            <FaCheckCircle className={style.successIcon} />
                            <div className={style.mensage}>
                                <h1>Senha Atualizada!</h1>
                                <p>A sua nova senha foi salva com sucesso.</p>
                            </div>
                            <Link to="/student/auth" className={style.primaryBtn} style={{marginTop: '20px'}}>Fazer Login</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={style.inputGroup}>
                                <input 
                                    type="password" 
                                    placeholder='Nova Senha'
                                    {...register("password", { 
                                        required: "A senha é obrigatória",
                                        minLength: { value: 8, message: "Pelo menos 8 caracteres" }
                                    })} 
                                />
                                {errors.password && <span className={style.errorMsg}>{errors.password.message}</span>}
                            </div>

                            <div className={style.inputGroup}>
                                <input 
                                    type="password" 
                                    placeholder='Confirmar Senha'
                                    {...register("confirmPassword", { 
                                        required: "Confirme a nova senha",
                                        validate: (value) => 
                                            value === watch('password') || "As senhas não coincidem"
                                    })} 
                                />
                                {errors.confirmPassword && <span className={style.errorMsg}>{errors.confirmPassword.message}</span>}
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
                                    {isSubmitting ? 'A salvar...' : (
                                        <>
                                            Salvar <FaPaperPlane />
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

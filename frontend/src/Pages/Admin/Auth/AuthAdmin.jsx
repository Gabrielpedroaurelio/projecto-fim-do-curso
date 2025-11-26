import style from './AuthAdmin.module.css'
import { useForm } from "react-hook-form";
import {Link} from 'react-router-dom'
import favicon from '../../../assets/images/favicon.ico'
import { createRecord, escapeHtml } from '../../../Services/ModelServices';
import fundo_login from '../../../assets/images/backgroundlogin.png'
import { useEffect } from 'react';

export default function AuthAdmin() {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const url = ''

    function onSubmit(data) {
    
            const { email, password } = data
            data = {
                email: escapeHtml(email),
                password: escapeHtml(password),
            }
            console.log(data);
            
        
            async () => {
                    const result = await createRecord(url, data)
                    console.log(result);
            }
      

 

    }
    return (
        <>
            <div className={style.containerForm}>
                <div className={style.cardForm}>
                    <div className={style.form}>
                        <div className={style.infos}>
                            <div className={style.logo}>
                                <img src={favicon} alt="" width={30} /> <small className='s'>IPM</small>
                            </div>
                            <div className={style.mensage}>
                                <h1>Olá,<br /> Bem-Vindo de Volta</h1>
                                <small className=' text-gray-400'>Oi, bem-vindo de volta ao nosso sistema</small>
                            </div>

                        </div>
                        <form onSubmit={
                           handleSubmit(onSubmit)
                        }>
                            <div className={style.inputController}>

                                <input type="text" placeholder='E-mail'  {...register("email", {
                                    required: "E-mail é um campo Obrigatório"
                                })}
                                />
                                {
                                    errors && (

                                        <p className={style.errorRequiredInput}>{errors.email?.message}</p>
                                    )
                                }
                            </div>
                            <div className={style.inputController}>
                                <input type="password" placeholder='Palavra-Passe' {...register("password",
                                    {
                                        required: "Palavra-Passe é um campo Obrigatório"

                                    })} />
                                {
                                    errors && (

                                        <p className={style.errorRequiredInput}>{errors.password?.message}</p>
                                    )
                                }
                            </div>



                            <div className={style.forgotPassword}>
                                <small>  <Link to='/admin/dashboards'>Esqueceu a Senha?</Link></small>
                            </div>
                            <div className={style.inputController}>
                                <button type='submit'>Iniciar Sessão</button>
                            </div>
                        </form>
                    </div>
                    <div className={style.background}>
                        <div>
                            <img src={fundo_login} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
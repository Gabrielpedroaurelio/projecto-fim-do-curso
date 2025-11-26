import { useReducer, useState } from "react"
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import favicon from '../../../assets/images/favicon.ico'
import imgLoginParant from '../../../assets/images/img-login-Parants.png'
import imgLoginStudent from '../../../assets/images/img-login-Student.png'
import style from './AuthPublic.module.css'
export default function AuthPublic() {
    const imageslogins = [
        imgLoginStudent,
        imgLoginParant
    ]
    
    function ChangeView(values, action) {
        switch (action.actiontype) {
            case 'increment':
                return { value: 1 }

            case 'decrement':
                return { value: 0 }


            default:
                break;
        }

    }
    const { register, handleSubmit, formState: { errors } } = useForm()
    function LoginEffect(data) {
        console.log(data);


    }
    const [indexloginviews, setindexloginviews] = useReducer(ChangeView, { value: 0 })
    return (
        <>
            <div className={style.ContainerLoginPublic}>
                <div className={style.CardLoginPublic}>
                    <form onSubmit={handleSubmit(LoginEffect)}>
                        <div>
                            <img src={favicon} alt="" width={40} />
                            <h1>Login</h1>
                            <small>Instituito Politecnico do Maiombe</small>
                        </div>
                        <div>
                            <input type="text" placeholder="E-mail" {...register("email", {
                                required: "E-mail é um campo Obrigatório"
                            })} />
                            {
                                errors && (

                                    <p className={style.errorRequiredInput}>{errors.email?.message}</p>
                                )
                            }
                        </div>
                        <div>
                            <input type="text" placeholder="Palavra-Passe" {...register("password" ,{
                                required: "Senha é um campo Obrigatório"
                            })} />
                            {
                                errors && (

                                    <p className={style.errorRequiredInput}>{errors.password?.message}</p>
                                )
                            }
                        </div>
                        <div>
                            <Link to={''} className={style.forgotPassword}><small >Esqueceu a Senha?</small></Link>
                        </div>
                        <div>
                            <button>Iniciar Sessão</button>
                        </div>
                        <div>

                            {
                                indexloginviews.value == 0 ? (

                                    <button onClick={() => setindexloginviews({ actiontype: 'increment' })}
                                        className={style.btnChangeViewLogin} >Sou Encarregado</button>
                                ) : (
                                    <button onClick={() => setindexloginviews({ actiontype: 'decrement' })}
                                        className={style.btnChangeViewLogin}>Sou Estudante</button>
                                )
                            }

                        </div>
                    </form>
                    <div className={style.description}>
                        <div>
                            <h1><strong>Bem vindo ao Portal</strong>  do {indexloginviews.value==0?(<span>Estundate</span>):(<span>Encarregado</span>)}</h1>
                            <img src={imageslogins[indexloginviews.value]} alt="" />
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}
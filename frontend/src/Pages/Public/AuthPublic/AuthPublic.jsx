import { useState } from "react";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import favicon from '../../../assets/images/favicon.ico';
import imgLoginParant from '../../../assets/images/img-login-Parants.png';
import imgLoginStudent from '../../../assets/images/img-login-Student.png';
import style from './AuthPublic.module.css';

export default function AuthPublic() {

    // Array com imagens de cada tipo de login
    const imageslogins = [
        imgLoginStudent,
        imgLoginParant
    ];

    // Estado para alternar entre Estudante (0) e Encarregado (1)
    const [loginView, setLoginView] = useState(0);

    // react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Função que será chamada ao enviar o formulário
    function LoginEffect(data) {
        console.log("Dados do Login:", data);
        // Aqui você pode fazer a integração com API de login
    }

    return (
        <div className={style.ContainerLoginPublic}>
            <div className={style.CardLoginPublic}>

                {/* Formulário de login */}
                <form onSubmit={handleSubmit(LoginEffect)}>
                    {/* Cabeçalho */}
                    <div className={style.header}>
                        <img src={favicon} alt="favicon" width={40} />
                        <h1>Login</h1>
                        <small>Instituto Politécnico do Maiombe</small>
                    </div>

                    {/* Campo E-mail */}
                    <div className={style.inputGroup}>
                        <input 
                            type="email" 
                            placeholder="E-mail" 
                            {...register("email", { required: "E-mail é um campo obrigatório" })} 
                        />
                        {errors.email && <p className={style.errorRequiredInput}>{errors.email.message}</p>}
                    </div>

                    {/* Campo Senha */}
                    <div className={style.inputGroup}>
                        <input 
                            type="password" 
                            placeholder="Palavra-Passe" 
                            {...register("password", { required: "Senha é um campo obrigatório" })} 
                        />
                        {errors.password && <p className={style.errorRequiredInput}>{errors.password.message}</p>}
                    </div>

                    {/* Link esqueci a senha */}
                    <div className={style.forgotPasswordDiv}>
                        <Link to="" className={style.forgotPassword}><small>Esqueceu a Senha?</small></Link>
                    </div>

                    {/* Botão de login */}
                    <div className={style.buttonDiv}>
                        <button type="submit">Iniciar Sessão</button>
                    </div>

                    {/* Alternar entre Estudante e Encarregado */}
                    <div className={style.changeViewDiv}>
                        <button 
                            type="button"
                            onClick={() => setLoginView(loginView === 0 ? 1 : 0)}
                            className={style.btnChangeViewLogin}
                        >
                            {loginView === 0 ? "Sou Encarregado" : "Sou Estudante"}
                        </button>
                    </div>
                </form>

                {/* Descrição e imagem */}
                <div className={style.description}>
                    <div>
                        <h1>
                            <strong>Bem-vindo ao Portal</strong> do {loginView === 0 ? "Estudante" : "Encarregado"}
                        </h1>
                        <img src={imageslogins[loginView]} alt="Imagem de Login" />
                    </div>
                </div>

            </div>
        </div>
    );
}

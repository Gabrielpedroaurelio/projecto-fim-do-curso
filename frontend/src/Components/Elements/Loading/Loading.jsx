import React from 'react';
import style from './Loading.module.css';

const Loading = ({ message = "Sistema Gestão de Declarações" }) => {
    return (
        <div className={style.loadercontainer}>
            <div className={style.loadercontent}>
                <div className={style.loaderspinner}></div>
                <div style={{textAlign: 'center'}}>
                    <div className={style.loadertext}>{message}</div>
                    <div className={style.loadersubtext}>A carregar o sistema...</div>
                </div>
            </div>
        </div>
    );
};

export default Loading;

import React, { useState } from 'react';
import style from './AskStudent.module.css';
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiSendPlaneLine, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri';

const AskStudent = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    docType: '',
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.docType) return;

    // Simulate API call
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ docType: '', reason: '' })
    }, 4000);
  };

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'student'} />
      <main className='containelMainclient'>
        <Header text1="Estudante" text2="Nova Solicitação" />
        <div className={style.container}>
          <header className={style.header}>
            <h1>Solicitar Novo Documento</h1>
            <p>Selecione o documento desejado e descreva o motivo da solicitação.</p>
          </header>

          <div className={style.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={style.formGroup}>
                <label>Tipo de Documento</label>
                <select
                  className={style.select}
                  required
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                >
                  <option value="">Selecione um documento...</option>
                  <option value="matriz">Declaração de Matrícula</option>
                  <option value="boletim">Boletim Trimestral</option>
                  <option value="certificado">Certificado de Habilitações</option>
                  <option value="transferencia">Guia de Transferência</option>
                </select>
              </div>

              <div className={style.formGroup}>
                <label>Motivo / Observações (Opcional)</label>
                <textarea
                  className={style.textarea}
                  placeholder="Descreva brevemente o motivo da sua solicitação..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className={style.submitBtn} disabled={submitted}>
                {submitted ? (
                  <>
                    <RiCheckLine size={24} />
                    Solicitação Enviada!
                  </>
                ) : (
                  <>
                    <RiSendPlaneLine />
                    Enviar Solicitação
                  </>
                )}
              </button>
            </form>

            {submitted && (
              <div className={style.successMessage}>
                Sua solicitação foi recebida e está em processamento.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AskStudent;
import React, { useState, useEffect } from 'react';
import style from './SolicitacaoParent.module.css';

// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Header from '../../../../Components/Elements/Header/Header'
import { RiSendPlaneFill, RiCheckLine, RiUser3Line, RiFileList3Line, RiInformationLine } from 'react-icons/ri';
import { useAuth } from '../../../../Context/AuthContext';
import api from '../../../../Services/api';

const SolicitacaoParent = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [educandos, setEducandos] = useState([]);
  const [formData, setFormData] = useState({
    childId: '',
    docType: '',
    reason: '',
  });

  useEffect(() => {
    const fetchKids = async () => {
      try {
        if (user?.id) {
          const response = await api.get(`/encarregados/${user.id}/educandos/`);
          setEducandos(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar educandos:", error);
      }
    };
    fetchKids();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.docType || !formData.childId) return;

    setLoading(true);
    try {
      await api.post('/solicitacaodocumento/', {
        id_aluno: formData.childId,
        id_encarregado: user.id,
        tipo_documento: formData.docType,
        // A descrição/motivo pode ser enviada se o backend aceitar (verificar se existe campo no model)
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      alert("Ocorreu um erro ao enviar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ childId: '', docType: '', reason: '' });
  };

  return (
    <div className='containelGeralclient'>
      <MenuNavBarCliente user={'parent'} />
      <main className='containelMainclient'>
        <Header text1="Solicitações" text2="Centro de Serviços" />

        <div className={style.formContainer}>
          {!submitted ? (
            <div className={style.cardForm}>
              <header className={style.formHeader}>
                <h2>Nova Solicitação</h2>
                <p>Preencha os dados abaixo para solicitar documentos oficiais ou serviços administrativos para seus educandos de forma rápida e segura.</p>
              </header>

              <form onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                  <label><RiUser3Line /> Selecionar Educando</label>
                  <select
                    className={style.selectField}
                    required
                    value={formData.childId}
                    onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                  >
                    <option value="">Escolha um aluno...</option>
                    {educandos.map((kid) => (
                      <option key={kid.id_aluno} value={kid.id_aluno}>
                        {kid.nome_completo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={style.formGroup}>
                  <label><RiFileList3Line /> Tipo de Documento / Serviço</label>
                  <select
                    className={style.selectField}
                    required
                    value={formData.docType}
                    onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                  >
                    <option value="">Selecione o Documento...</option>
                    <option value="DECLARAÇÃO DE MATRÍCULA">Declaração de Matrícula</option>
                    <option value="BOLETIM TRIMESTRAL">Boletim Trimestral</option>
                    <option value="CERTIFICADO DE HABILITAÇÕES">Certificado de Habilitações</option>
                  </select>
                </div>

                <div className={style.formGroup}>
                  <label><RiInformationLine /> Informações Adicionais</label>
                  <textarea
                    className={style.textareaField}
                    placeholder="Descreva detalhes ou observações que possam ajudar no processamento da sua solicitação..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className={style.submitBtn} disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      Enviando...
                    </div>
                  ) : (
                    <>
                      <RiSendPlaneFill />
                      Enviar Solicitação Oficial
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className={style.successMessage}>
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-500/20 p-4 rounded-full">
                  <RiCheckLine size={64} className="text-emerald-500" />
                </div>
              </div>
              <h3>Solicitação Enviada!</h3>
              <p>O seu pedido foi registado com sucesso em nosso sistema. Receberá uma notificação assim que o documento estiver pronto para levantamento.</p>
              <button onClick={handleReset} className={style.submitBtn} style={{ marginTop: '2rem', background: 'var(--bg-input)', color: 'var(--text-main)', boxShadow: 'none' }}>
                Fazer Nova Solicitação
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SolicitacaoParent;


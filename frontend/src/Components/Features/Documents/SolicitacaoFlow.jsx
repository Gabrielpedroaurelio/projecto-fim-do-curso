import React, { useState, useEffect } from 'react';
import style from './SolicitacaoFlow.module.css';
import { RiUser3Line, RiFileList3Line, RiWallet3Line, RiCheckLine, RiPrinterLine, RiSmartphoneLine, RiArrowRightLine, RiArrowLeftLine, RiSearchLine } from 'react-icons/ri';
import api from '../../../Services/api';

import { useAuth } from '../../../Context/AuthContext';

const SolicitacaoFlow = ({ userType = 'aluno', fixedStudent = null, onComplete }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [studentInfo, setStudentInfo] = useState(fixedStudent);
    const [biSearch, setBiSearch] = useState('');
    const [myStudents, setMyStudents] = useState([]); // Para encarregados

    // ... states existentes ...
    const [selectedDoc, setSelectedDoc] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const docOptions = [
        { id: 'DECLARAÇÃO', label: 'Declaração de Matrícula (Com Notas)' },
        { id: 'DECLARAÇÃO_SIMPLES', label: 'Declaração de Matrícula (Sem Notas)' },
        { id: 'CERTIFICADO', label: 'Certificado de Habilitações' },
        { id: 'BOLETIM', label: 'Boletim de Notas' }
    ];

    useEffect(() => {
        const fetchMyStudents = async () => {
            try {
                if (user?.id) {
                    const response = await api.get(`/encarregados/${user.id}/educandos/`);
                    setMyStudents(response.data);
                }
            } catch {
                console.error("Erro ao buscar educandos");
            }
        };

        if (fixedStudent) {
            setStudentInfo(fixedStudent);
            setStep(2);
        } else if (userType === 'encarregado' && user?.id) {
            fetchMyStudents();
        }
    }, [fixedStudent, user, userType]);

    // Função de selecionar da lista
    const handleStudentSelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;
        const student = myStudents.find(s => s.id_aluno === parseInt(selectedId));
        if (student) {
            setStudentInfo(student);
            // reset error
            setError('');
        }
    };

    const confirmStudentSelection = () => {
        if (studentInfo) {
            setStep(2);
        }
    };

    const searchStudent = async () => {
        if (!biSearch) return;
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/alunos/?search=${biSearch}`);
            if (response.data.results && response.data.results.length > 0) {
                setStudentInfo(response.data.results[0]);
                setStep(2);
            } else {
                setError('Estudante não encontrado com este BI.');
            }
        } catch {
            setError('Erro ao pesquisar estudante.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!studentInfo || !selectedDoc) return;
        setLoading(true);
        setError('');
        try {
            const payload = {
                id_aluno: studentInfo.id_aluno,
                tipo_documento: selectedDoc,
                canal_pagamento_rup: paymentMethod === 'confirmado_local' ? 'fisico_rup' : paymentMethod, // Backend default to fisico if confirming locally
                id_encarregado: userType === 'encarregado' ? user.id : null,
                id_funcionario: userType === 'funcionario' ? user.id : null
            };

            const response = await api.post('/solicitacoes/', payload);
            let finalResult = response.data;

            // Se for funcionário e escolheu confirmar pagamento na hora
            if (userType === 'funcionario' && paymentMethod === 'confirmado_local') {
                const idSolicitacao = response.data.solicitacao.id_solicitacao;
                const confirmResponse = await api.post(`/solicitacoes/${idSolicitacao}/confirmar_pagamento/`, {
                    id_funcionario: user.id
                });
                // Merge result to show success/download
                finalResult = { ...finalResult, ...confirmResponse.data, confirmed: true };
            }

            setResult(finalResult);
            setStep(4);
            if (onComplete) onComplete(finalResult);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Erro ao processar solicitação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.flowContainer}>
            <div className={style.stepper}>
                {/* ... steps ... */}
                <div className={`${style.step} ${step >= 1 ? style.active : ''}`}>
                    <div className={style.stepIcon}><RiUser3Line /></div>
                    <span>Identificação</span>
                </div>
                <div className={style.stepLine} />
                <div className={`${style.step} ${step >= 2 ? style.active : ''}`}>
                    <div className={style.stepIcon}><RiFileList3Line /></div>
                    <span>Confirmação</span>
                </div>
                <div className={style.stepLine} />
                <div className={`${style.step} ${step >= 3 ? style.active : ''}`}>
                    <div className={style.stepIcon}><RiWallet3Line /></div>
                    <span>Pagamento</span>
                </div>
            </div>

            <div className={style.stepContent}>
                {step === 1 && (
                    <div className={style.stepIn}>
                        <h2>Identificar Estudante</h2>

                        {userType === 'encarregado' && myStudents.length > 0 ? (
                            <div className={style.searchBox} style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <p>Selecione um dos seus educandos abaixo:</p>
                                <select
                                    className={style.selectField}
                                    onChange={handleStudentSelect}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Escolha o aluno...</option>
                                    {myStudents.map(student => (
                                        <option key={student.id_aluno} value={student.id_aluno}>
                                            {student.nome_completo} ({student.classe_nivel}ª Classe)
                                        </option>
                                    ))}
                                </select>

                                <button
                                    className={style.btnNext}
                                    onClick={confirmStudentSelection}
                                    disabled={!studentInfo}
                                    style={{ marginTop: '1rem' }}
                                >
                                    Avançar <RiArrowRightLine />
                                </button>

                                <div className={style.dividerLine}>
                                    <p>Ou pesquise por outro BI se necessário:</p>
                                </div>
                            </div>
                        ) : null}

                        {/* Search Box - Default for Funcionario or Fallback */}
                        <div className={style.searchBox} style={userType === 'funcionario' ? { marginTop: 0 } : {}}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                                {userType === 'funcionario' ? 'Pesquisar Aluno por BI' : 'Pesquisar por BI'}
                            </h4>
                            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder="Digite o número do BI..."
                                    value={biSearch}
                                    onChange={(e) => setBiSearch(e.target.value.toUpperCase())}
                                    style={{ flex: 1 }}
                                />
                                <button onClick={searchStudent} disabled={loading}>
                                    {loading ? '...' : <RiSearchLine />}
                                </button>
                            </div>
                        </div>
                        {error && <p className={style.errorMsg}>{error}</p>}
                    </div>
                )}

                {step === 2 && studentInfo && (
                    // ... step 2 content ...
                    <div className={style.stepIn}>
                        <h2>Confirmar Dados do Educando</h2>
                        <div className={style.confirmCard}>
                            <div className={style.studentSummary}>
                                <div className={style.avatar}>
                                    {studentInfo.img_path ? <img src={studentInfo.img_path} alt="" /> : <RiUser3Line />}
                                </div>
                                <div className={style.details}>
                                    <h3>{studentInfo.nome_completo}</h3>
                                    <p>BI: {studentInfo.numero_bi}</p>
                                    <p>Matrícula: {studentInfo.numero_matricula}</p>
                                    <p>{studentInfo.classe_nivel || 'Classe N/A'} - {studentInfo.curso_nome || 'Curso N/A'}</p>
                                </div>
                            </div>

                            <div className={style.formGroup}>
                                <label>Tipo de Documento Desejado:</label>
                                <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}>
                                    <option value="">Selecione um documento...</option>
                                    {docOptions.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={style.actions}>
                            <button className={style.btnPrev} onClick={() => setStep(1)}>
                                <RiArrowLeftLine /> Voltar
                            </button>
                            <button
                                className={style.btnNext}
                                onClick={() => setStep(3)}
                                disabled={!selectedDoc}
                            >
                                Próximo (Pagamento) <RiArrowRightLine />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={style.stepIn}>
                        <h2>Opção de Pagamento do RUP</h2>

                        {userType === 'funcionario' ? (
                            <div className={style.paymentGrid}>
                                <div
                                    className={`${style.paymentOption} ${paymentMethod === 'fisico_rup' ? style.selected : ''}`}
                                    onClick={() => setPaymentMethod('fisico_rup')}
                                >
                                    <RiPrinterLine className={style.payIcon} />
                                    <h3>Gerar RUP (Impressão)</h3>
                                    <p>Imprimir formulário de RUP para o requisitante pagar no banco/TPA.</p>
                                </div>
                                <div
                                    className={`${style.paymentOption} ${paymentMethod === 'confirmado_local' ? style.selected : ''}`}
                                    onClick={() => setPaymentMethod('confirmado_local')}
                                >
                                    <RiCheckLine className={style.payIcon} />
                                    <h3>Confirmar Pagamento Já Realizado</h3>
                                    <p>Se o requisitante já pagou ou pagou via TPA na escola.</p>
                                </div>
                            </div>
                        ) : (
                            // Default Parent/Student view
                            <div className={style.paymentGrid}>
                                <div
                                    className={`${style.paymentOption} ${paymentMethod === 'express' ? style.selected : ''}`}
                                    onClick={() => setPaymentMethod('express')}
                                >
                                    <RiSmartphoneLine className={style.payIcon} />
                                    <h3>Multicaixa Express</h3>
                                    <p>Pague instantaneamente através da aplicação no seu telemóvel.</p>
                                </div>

                                <div
                                    className={`${style.paymentOption} ${paymentMethod === 'fisico_rup' ? style.selected : ''}`}
                                    onClick={() => setPaymentMethod('fisico_rup')}
                                >
                                    <RiPrinterLine className={style.payIcon} />
                                    <h3>Imprimir RUP</h3>
                                    <p>Gere o formulário para pagar num balcão ou TPA. Válido por 24h.</p>
                                </div>
                            </div>
                        )}

                        {error && <p className={style.errorMsg}>{error}</p>}

                        <div className={style.actions}>
                            <button className={style.btnPrev} onClick={() => setStep(2)}>
                                <RiArrowLeftLine /> Voltar
                            </button>
                            <button
                                className={style.btnSubmit}
                                onClick={handleSubmit}
                                disabled={!paymentMethod || loading}
                            >
                                {loading ? 'Processando...' : 'Finalizar Solicitação'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && result && (
                    <div className={`${style.stepIn} ${style.successStep}`}>
                        <div className={style.successIcon}><RiCheckLine /></div>
                        <h2>Solicitação Realizada com Sucesso!</h2>
                        <p>O pedido de <strong>{selectedDoc}</strong> foi registado.</p>

                        {/* Employee: Payment Confirmed Immediately */}
                        {userType === 'funcionario' && result.confirmed ? (
                            <div className={style.rupAviso} style={{ borderColor: 'var(--success-color)' }}>
                                <RiPrinterLine color="var(--success-color)" />
                                <div>
                                    <h4>Documento Final Pronto</h4>
                                    <p>O pagamento foi confirmado e o documento gerado com certificação digital.</p>
                                    <button
                                        className={style.btnDownload}
                                        onClick={() => window.open(result.download_url || result.caminho_arquivo, '_blank')}
                                    >
                                        Imprimir Documento Oficial (PDF)
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Standard RUP Flow (Employee printing RUP or User/Employee chose RUP)
                            (paymentMethod === 'fisico_rup' || (userType === 'funcionario' && paymentMethod === 'fisico_rup')) ? (
                                <div className={style.rupAviso}>
                                    <RiPrinterLine />
                                    <div>
                                        <h4>RUP Gerado</h4>
                                        <p>Formulário de RUP válido por <strong>24 horas</strong>.</p>

                                        {userType === 'funcionario' ? (
                                            <button
                                                className={style.btnDownload}
                                                // Assuming we have an endpoint or logic to get the RUP PDF URL
                                                onClick={() => window.open(`${api.defaults.baseURL}solicitacoes/${result.solicitacao ? result.solicitacao.id_solicitacao : result.id_solicitacao}/imprimir_rup/`, '_blank')}
                                            >
                                                Imprimir Formulário RUP para Requisitante
                                            </button>
                                        ) : (
                                            <button className={style.btnDownload} onClick={() => window.open(result.fatura.url_fatura, '_blank')}>
                                                Baixar Formulário RUP (PDF)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p>Por favor, confirme o pagamento na sua aplicação Multicaixa Express para que possamos processar o documento.</p>
                            )
                        )}

                        <div className={style.instruction}>
                            {userType === 'funcionario' && result.confirmed
                                ? <p>Entregue o documento impresso ao Diretor para assinatura manual se necessário.</p>
                                : <p>O documento oficial estará disponível após a confirmação do pagamento e assinatura do Diretor.</p>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolicitacaoFlow;

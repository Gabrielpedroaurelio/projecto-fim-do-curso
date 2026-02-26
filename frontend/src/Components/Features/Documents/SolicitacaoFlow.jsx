import React, { useState, useEffect, useMemo } from 'react';
import style from './SolicitacaoFlow.module.css';
import { RiUser3Line, RiFileList3Line, RiWallet3Line, RiCheckLine, RiPrinterLine, RiSmartphoneLine, RiArrowRightLine, RiArrowLeftLine, RiSearchLine, RiErrorWarningLine } from 'react-icons/ri';
import api from '../../../Services/api';

import { useAuth } from '../../../Context/AuthContext';

const SolicitacaoFlow = ({ userType = 'aluno', fixedStudent = null, onComplete }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [studentInfo, setStudentInfo] = useState(fixedStudent);
    const [biSearch, setBiSearch] = useState('');
    const [myStudents, setMyStudents] = useState([]);

    const [selectedDoc, setSelectedDoc] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const [missingFields, setMissingFields] = useState({});
    const [isEditingMissing, setIsEditingMissing] = useState(false);

    // New state for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingSolicitacao, setPendingSolicitacao] = useState(null);

    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const docOptions = [
        { id: 'DECLARAÇÃO_EMPREGO', label: 'Declaração (Efeito de Emprego)' },
        { id: 'DECLARAÇÃO_PASSAPORTE', label: 'Declaração (Efeito de Passaporte)' },
        { id: 'DECLARAÇÃO_MATRICULA', label: 'Declaração (Efeito de Matrícula)' },
        { id: 'DECLARAÇÃO_OUTROS', label: 'Declaração (Outros Fins)' },
        { id: 'DECLARAÇÃO_APROVEITAMENTO', label: 'Declaração de Aproveitamento (Com Notas)' },
        { id: 'CERTIFICADO', label: 'Certificado de Conclusão' },
        { id: 'BOLETIM_1', label: 'Boletim (I Trimestre)' },
        { id: 'BOLETIM_2', label: 'Boletim (II Trimestre)' },
        { id: 'BOLETIM_3', label: 'Boletim (III Trimestre)' }
    ];

    // Fields to check
    const mandatoryFields = useMemo(() => [
        { key: 'nome_pai', label: 'Nome do Pai' },
        { key: 'nome_mae', label: 'Nome da Mãe' },
        { key: 'data_nascimento', label: 'Data de Nascimento', type: 'date' },
        { key: 'naturalidade', label: 'Naturalidade' },
        { key: 'provincia_naturalidade', label: 'Província de Naturalidade' },
        { key: 'data_emissao_bilhete', label: 'Data de Emissão do BI', type: 'date' }
    ], []);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await api.get('/classes/');
                setClasses(response.data.results || response.data);
            } catch (err) {
                console.error("Erro ao buscar classes", err);
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        // Desativado: Não travar mais a solicitação por falta de dados (Pai/Mãe/etc)
        setIsEditingMissing(false);
    }, [studentInfo]);

    const handleMissingFieldChange = (key, value) => {
        setMissingFields(prev => ({ ...prev, [key]: value }));
    };

    const saveMissingData = async () => {
        try {
            setLoading(true);
            setError('');
            // Validar se todos foram preenchidos
            for (const key in missingFields) {
                if (!missingFields[key]) {
                    setError(`Por favor, preencha o campo ${mandatoryFields.find(f => f.key === key).label}`);
                    setLoading(false);
                    return;
                }
            }

            await api.patch(`/alunos/${studentInfo.id_aluno}/`, missingFields);
            const updated = { ...studentInfo, ...missingFields };
            setStudentInfo(updated);
            setIsEditingMissing(false);
            setError('');
        } catch (error) {
            setError(`Erro ao atualizar dados do aluno. <br> Erro: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const availableClasses = useMemo(() => {
        // Filtra classes baseado na regra de negócio e no aluno selecionado
        if (!studentInfo || !selectedDoc || classes.length === 0) {
            return [];
        }

        // Extração robusta do nível da classe
        const currentLevel = parseInt(
            studentInfo.classe_nivel || 
            studentInfo.perfil?.id_turma?.id_classe?.nivel ||
            studentInfo.aluno?.id_turma?.id_classe?.nivel ||
            studentInfo.turma_detalhes?.classe?.nivel || 
            studentInfo.id_turma?.id_classe?.nivel || 
            0
        );

        let filtered = [];

        // Regras:
        // Declaração: < currentLevel
        // Boletim: <= currentLevel
        // Certificado: == 13
        const docUpper = selectedDoc.toUpperCase();
        
        if (docUpper.includes('DECLARAÇÃO')) {
            if (docUpper.includes('APROVEITAMENTO')) {
                // Com notas: apenas classes passadas
                filtered = classes.filter(c => c.nivel < currentLevel);
            } else {
                // Sem notas: permite a classe actual (igual ao boletim)
                filtered = classes.filter(c => c.nivel <= currentLevel);
            }
        } else if (docUpper.includes('BOLETIM')) {
            filtered = classes.filter(c => c.nivel <= currentLevel);
        } else if (docUpper.includes('CERTIFICADO')) {
            filtered = classes.filter(c => c.nivel === 13);
        } else {
            // Fallback para outros documentos (se houver)
            filtered = classes.filter(c => c.nivel <= currentLevel);
        }

        return filtered.sort((a, b) => b.nivel - a.nivel);
    }, [selectedDoc, studentInfo, classes]);

    useEffect(() => {
        const fetchMyStudents = async () => {
            try {
                if (user?.id || user?.id_aluno || user?.id_encarregado) {
                    const id = user.id_encarregado || user.id_aluno || user.id;
                    const response = await api.get(`/encarregados/${id}/educandos/`);
                    setMyStudents(response.data);
                }
            } catch {
                console.error("Erro ao buscar educandos");
            }
        };

        if (fixedStudent) {
            setStudentInfo(fixedStudent);
            setStep(2);
        } else if (userType === 'encarregado' && (user?.id || user?.id_encarregado)) {
            fetchMyStudents();
        }
    }, [fixedStudent, user, userType]);

    const handleStudentSelect = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) return;
        const student = myStudents.find(s => s.id_aluno === parseInt(selectedId));
        if (student) {
            setStudentInfo(student);
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
                canal_pagamento_rup: paymentMethod === 'confirmado_local' ? 'fisico_rup' : paymentMethod,
                id_encarregado: userType === 'encarregado' ? (user.id_encarregado || user.id) : null,
                id_funcionario: userType === 'funcionario' ? (user.id_funcionario || user.id) : null,
                classe_solicitada: selectedClass || null
            };

            // 1. Criar Solicitação (Sempre cria pendente)
            const response = await api.post('/solicitacoes/', payload);
            const data = response.data;

            // Se for funcionário + Pagamento Instantâneo, abrir modal de conferência
            if (userType === 'funcionario' && paymentMethod === 'confirmado_local') {
                setPendingSolicitacao(data);
                setShowConfirmModal(true);
                setLoading(false);
                return;
            }

            // Fluxo normal (RUP para User/Funcionario que escolheu RUP)
            setResult(data);
            setStep(4);
            // Don't call onComplete immediately, let changes be viewed
            // if (onComplete) onComplete(data);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Erro ao processar solicitação.');
        } finally {
            if (paymentMethod !== 'confirmado_local') {
                setLoading(false);
            }
        }
    };

    const handleConfirmPayment = async () => {
        if (!pendingSolicitacao) return;
        setLoading(true);
        try {
            // 2. Confirmar Pagamento
            const idSolicitacao = pendingSolicitacao.solicitacao ? pendingSolicitacao.solicitacao.id_solicitacao : pendingSolicitacao.id_solicitacao;

            const confirmResponse = await api.post(`/solicitacoes/${idSolicitacao}/confirmar_pagamento/`, {
                id_funcionario: user.id_funcionario || user.id
            });

            // Mesclar resultados
            const finalResult = { ...pendingSolicitacao, ...confirmResponse.data, confirmed: true };

            // Auto-open PDF if available
            if (finalResult.download_url || finalResult.caminho_arquivo) {
                const url = finalResult.download_url || finalResult.caminho_arquivo;
                // Try to open in new tab
                window.open(url, '_blank');
            }

            setResult(finalResult);
            setShowConfirmModal(false);
            setShowSuccessModal(true); // Show success modal instead of going directly to step 4
            // if (onComplete) onComplete(finalResult); 
        } catch (err) {
            console.error("ERRO AO CONFIRMAR PAGAMENTO:", {
                status: err.response?.status,
                data: err.response?.data,
                config: err.config
            });

            const msg = err.response?.data?.error || err.response?.data?.detail || "Erro ao confirmar pagamento.";
            setError(msg);
            alert(`Falha na confirmação: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper to print RUP
    const handlePrintRUP = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/solicitacoes/${id}/imprimir_rup/`);
            if (response.data.download_url) {
                window.open(response.data.download_url, '_blank');
            } else {
                alert("Erro ao obter URL do RUP.");
            }
        } catch (error) {
            console.error("Erro ao imprimir RUP", error);
            alert("Não foi possível gerar o RUP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.flowContainer}>
            {/* Modal de Confirmação de Pagamento Instantâneo */}
            {showConfirmModal && pendingSolicitacao && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h3><RiWallet3Line /> Confirmar Pagamento</h3>
                        </div>
                        <div className={style.modalBody}>
                            <div className={style.rupDisplay}>
                                <label>Referência Bancária (RUP)</label>
                                <div className={style.rupCode}>{pendingSolicitacao.solicitacao?.rupe || '---'}</div>
                            </div>

                            <div className={style.detailsList}>
                                <p><strong>Aluno:</strong> {pendingSolicitacao.solicitacao?.aluno_nome}</p>
                                <p><strong>Documento:</strong> {pendingSolicitacao.solicitacao?.tipo_documento}</p>
                                <p><strong>Valor a Receber:</strong> {pendingSolicitacao.fatura?.total ? new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(pendingSolicitacao.fatura.total) : '---'}</p>
                            </div>

                            <div className={style.alertInfo}>
                                <RiErrorWarningLine />
                                <p>Confirme que recebeu o valor acima do requerente. A validação gera o documento imediatamente.</p>
                            </div>
                        </div>
                        <div className={style.modalActions}>
                            <button
                                className={style.btnCancel}
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setStep(4); // Vai para sucesso mas Pendente (como RUP normal)
                                    setResult(pendingSolicitacao);
                                }}
                            >
                                Cancelar (Manter Pendente)
                            </button>
                            <button
                                className={style.btnConfirm}
                                onClick={handleConfirmPayment}
                                disabled={loading}
                            >
                                {loading ? 'A confirmar...' : 'Confirmar Pagamento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal - Shows after payment confirmation */}
            {showSuccessModal && result && (
                <div className={style.modalOverlay}>
                    <div className={`${style.modalContent} ${style.successModal}`}>
                        <div className={style.successIcon}>
                            <RiCheckLine />
                        </div>
                        <h2>Operação Realizada com Sucesso!</h2>
                        <p className={style.successMessage}>
                            O pagamento foi confirmado e o documento foi gerado automaticamente.
                        </p>

                        <div className={style.successDetails}>
                            <div className={style.detailItem}>
                                <RiFileList3Line />
                                <div>
                                    <span>Documento</span>
                                    <strong>{result.solicitacao?.tipo_documento || result.tipo_documento}</strong>
                                </div>
                            </div>
                            <div className={style.detailItem}>
                                <RiUser3Line />
                                <div>
                                    <span>Aluno</span>
                                    <strong>{result.solicitacao?.aluno_nome || result.aluno_nome}</strong>
                                </div>
                            </div>
                        </div>

                        <div className={style.modalActions}>
                            <button
                                className={style.btnSecondary}
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setStep(1);
                                    // Reset form
                                    setStudentInfo(fixedStudent);
                                    setSelectedDoc('');
                                    setSelectedClass('');
                                    setPaymentMethod('');
                                    setResult(null);
                                }}
                            >
                                Nova Solicitação
                            </button>
                            <button
                                className={style.btnPrimary}
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setStep(4);
                                }}
                            >
                                <RiCheckLine /> Ver Resultado
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={style.stepper}>
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
                {
                   // useLayoutEffect(() => {
                        step === 1 && (
                            <div className={style.stepIn}>
                                <h2>Identificar Estudante</h2>

                                {


                                    userType === 'encarregado' && myStudents.length > 0 ? (
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
                                            {error && <p className={style.errorMsg}>{error}</p>}
                                        </div>
                                    ) : (
                                        /* Search Box - Default for Funcionario or Fallback */
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
                                                    {loading ? 'Pesquisando...' : <RiSearchLine />}
                                                </button>
                                            </div>
                                            {error && <p className={style.errorMsg}>{error}</p>}
                                        </div>
                                    )

                                }
                            </div>

                        )
                   // }, [userType])
                }


                {step === 2 && studentInfo && (
                    <div className={style.stepIn}>
                        <h2>Confirmar Dados do Educando</h2>
                        <div className={style.confirmCard}>
                            <div className={style.studentSummary}>
                                <div className={style.avatar}>
                                    {studentInfo.img_path ? <img src={studentInfo.img_path} alt="" /> : <RiUser3Line />}
                                </div>
                                <div className={style.details}>
                                    <h3>{studentInfo.nome_completo || studentInfo.nome}</h3>
                                    <p><strong>BI:</strong> {studentInfo.numero_bi}</p>
                                    <p><strong>Matrícula:</strong> {studentInfo.numero_matricula}</p>
                                    <p>
                                        <strong>Actual:</strong> {
                                            studentInfo.classe_nivel || 
                                            studentInfo.turma_detalhes?.classe?.nivel || 
                                            studentInfo.id_turma?.id_classe?.nivel || 
                                            '?'
                                        }ª Classe - {
                                            studentInfo.curso_nome || 
                                            studentInfo.perfil?.id_turma?.id_curso?.nome_curso ||
                                            studentInfo.aluno?.id_turma?.id_curso?.nome_curso ||
                                            studentInfo.turma_detalhes?.curso?.nome || 
                                            studentInfo.id_turma?.id_curso?.nome_curso || 
                                            'Curso N/A'
                                        }
                                    </p>
                                </div>
                                <div className={style.actionsTop}>
                                    <button className={style.btnWrongData} onClick={() => {
                                        if (window.confirm("Deseja cancelar esta solicitação e voltar ao início?")) {
                                            setStep(1);
                                            setStudentInfo(fixedStudent ? fixedStudent : null);
                                        }
                                    }}>
                                        <RiErrorWarningLine /> Dados Incorretos? (Cancelar)
                                    </button>
                                </div>
                            </div>

                            {/* Missing Data Form */}
                            {isEditingMissing ? (
                                <div className={style.missingDataForm}>
                                    <div className={style.alertInfo}>
                                        <RiErrorWarningLine />
                                        <p>Para prosseguir, precisamos completar as informações em falta no seu cadastro:</p>
                                    </div>
                                    <div className={style.gridForm}>
                                        {mandatoryFields.filter(f => studentInfo[f.key] === null || studentInfo[f.key] === '').map(field => (
                                            <div key={field.key} className={style.formGroup}>
                                                <label>{field.label}</label>
                                                <input
                                                    type={field.type || 'text'}
                                                    value={missingFields[field.key] || ''}
                                                    onChange={(e) => handleMissingFieldChange(field.key, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button className={style.btnSave} onClick={saveMissingData} disabled={loading}>
                                        {loading ? 'Salvando...' : 'Salvar e Continuar'}
                                    </button>
                                </div>
                            ) : (
                                <div className={style.selectionArea}>
                                    <div className={style.formGroup}>
                                        <label>Tipo de Documento Desejado:</label>
                                        <select value={selectedDoc} onChange={(e) => {
                                            setSelectedDoc(e.target.value);
                                            setSelectedClass('');
                                        }}>
                                            <option value="">Selecione um documento...</option>
                                            {docOptions.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedDoc && (
                                        <div className={style.formGroup}>
                                            <label>Referente à Classe:</label>
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                disabled={availableClasses.length === 0}
                                            >
                                                <option value="">Selecione a classe...</option>
                                                {availableClasses.map(cls => (
                                                    <option key={cls.id_classe} value={cls.id_classe}>
                                                        {cls.nivel}ª Classe ({cls.descricao})
                                                    </option>
                                                ))}
                                            </select>
                                            {availableClasses.length === 0 && (
                                                <span className={style.helperText}>Nenhuma classe disponível para este documento conforme as regras de emissão.</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!isEditingMissing && (
                            <div className={style.actions}>
                                <button className={style.btnPrev} onClick={() => setStep(1)}>
                                    <RiArrowLeftLine /> Voltar
                                </button>
                                <button
                                    className={style.btnNext}
                                    onClick={() => setStep(3)}
                                    disabled={!selectedDoc || !selectedClass}
                                >
                                    Próximo (Pagamento) <RiArrowRightLine />
                                </button>
                            </div>
                        )}
                        {error && <p className={style.errorMsg}>{error}</p>}
                    </div>
                )}

                {step === 3 && (
                    <div className={style.stepIn}>
                        <h2>Opção de Pagamento</h2>
                        <p className={style.stepDescription}>
                            Para concluir a solicitação, escolha como deseja realizar o pagamento do emolumento.
                        </p>

                        <div className={style.paymentGrid}>

                            {/* Option 1: Multicaixa Express (General Public) */}
                            <div className={`${style.paymentOption} ${style.disabled} ${paymentMethod === 'express' ? style.selected : ''}`}>
                                <div className={style.optionHeader}>
                                    <RiSmartphoneLine className={style.payIcon} />
                                    <span className={style.badge}>Em Breve</span>
                                </div>
                                <h3>Multicaixa Express</h3>
                                <p>Pagamento instantâneo via aplicativo MCX (Indisponível no momento).</p>
                            </div>

                            {/* Option 2: Manual / RUP (General Public & Employees) */}
                            <div
                                className={`${style.paymentOption} ${paymentMethod === 'fisico_rup' ? style.selected : ''}`}
                                onClick={() => setPaymentMethod('fisico_rup')}
                            >
                                <div className={style.optionHeader}>
                                    <RiPrinterLine className={style.payIcon} />
                                </div>
                                <h3>Pagamento por Referência (RUP)</h3>
                                <p>Gera um formulário RUP para pagamento em ATM ou Internet Banking. Válido por 24h.</p>
                            </div>

                            {/* Option 3: Instant Payment (Employees Only) */}
                            {userType === 'funcionario' && (
                                <div
                                    className={`${style.paymentOption} ${style.premiumOption} ${paymentMethod === 'confirmado_local' ? style.selected : ''}`}
                                    onClick={() => setPaymentMethod('confirmado_local')}
                                >
                                    <div className={style.optionHeader}>
                                        <RiWallet3Line className={style.payIcon} />
                                        <span className={style.badgeSuccess}>Exclusivo Funcionário</span>
                                    </div>
                                    <h3>Pagamento Instantâneo</h3>
                                    <p>Confirmar recebimento do valor na hora e gerar documento imediatamente.</p>
                                </div>
                            )}

                        </div>

                        {paymentMethod === 'confirmado_local' && (
                            <div className={style.alertInfo}>
                                <RiErrorWarningLine />
                                <p><strong>Atenção Funcionário:</strong> Ao selecionar "Pagamento Instantâneo", você confirma que recebeu o valor do emolumento em numerário ou TPA. O documento será emitido imediatamente.</p>
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
                                {loading ? 'Processando...' : (paymentMethod === 'confirmado_local' ? 'Confirmar e Gerar Documento' : 'Gerar RUP e Finalizar')}
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
                                    <h4>Operação Realizada com Sucesso</h4>
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
                                        <p style={{ fontSize: '0.9em', color: '#666' }}>O documento será listado no painel do aluno.</p>

                                        <button
                                            className={style.btnDownload}
                                            onClick={() => handlePrintRUP(result.solicitacao ? result.solicitacao.id_solicitacao : result.id_solicitacao)}
                                            disabled={loading}
                                        >
                                            {loading ? 'Preparando...' : 'Imprimir Formulário RUP (PDF)'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>Por favor, confirme o pagamento na sua aplicação Multicaixa Express para que possamos processar o documento.</p>
                            )
                        )}

                        <div className={style.instruction}>
                            {userType === 'funcionario' && result.confirmed
                                ? <p>Entregue o documento impresso ao Diretor para assinatura manual se necessário.</p>
                                : <p>O documento oficial estará disponível após a confirmação do pagamento e aprovação.</p>
                            }
                        </div>

                        {/* Final Close Button */}
                        <div className={style.actions} style={{ justifyContent: 'center', marginTop: '2rem' }}>
                            <button
                                className={style.btnSubmit} // Reuse submit styling for main action
                                onClick={() => {
                                    if (onComplete) onComplete(result);
                                }}
                                style={{ background: 'var(--text-main)', width: 'auto', padding: '0 2rem' }}
                            >
                                Fechar e Voltar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolicitacaoFlow;

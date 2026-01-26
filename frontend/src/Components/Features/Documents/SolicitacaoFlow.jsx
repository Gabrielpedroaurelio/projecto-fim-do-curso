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
    const [availableClasses, setAvailableClasses] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const [missingFields, setMissingFields] = useState({});
    const [isEditingMissing, setIsEditingMissing] = useState(false);

    const docOptions = [
        { id: 'DECLARAÇÃO', label: 'Declaração de Matrícula (Simples)' },
        { id: 'DECLARAÇÃO_APROVEITAMENTO', label: 'Declaração de Aproveitamento (Com Notas)' },
        { id: 'CERTIFICADO', label: 'Certificado de Habilitações' },
        { id: 'BOLETIM', label: 'Boletim de Notas' }
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
        if (studentInfo) {
            const missing = {};
            let hasMissing = false;
            mandatoryFields.forEach(field => {
                if (!studentInfo[field.key]) {
                    missing[field.key] = '';
                    hasMissing = true;
                }
            });
            if (hasMissing) {
                setMissingFields(missing);
                setIsEditingMissing(true);
            } else {
                setMissingFields({});
                setIsEditingMissing(false);
            }
        }
    }, [studentInfo, mandatoryFields]);

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
        } catch (err) {
            setError("Erro ao atualizar dados do aluno.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Filtra classes baseado na regra de negócio e no aluno selecionado
        if (!studentInfo || !selectedDoc || classes.length === 0) {
            setAvailableClasses([]);
            return;
        }

        const currentLevel = parseInt(studentInfo.classe_nivel || 0);
        let filtered = [];

        // Regras Reais:
        // Declaração: Máximo permitida = Classe Atual - 1 (ex: aluno da 12ª só pede até 11ª)
        // Boletim: Permitida Classe Atual ou inferior
        // Certificado: Apenas se aprovado na última classe do ciclo (13ª) ou Ex-aluno finalizado

        if (selectedDoc === 'DECLARAÇÃO' || selectedDoc === 'DECLARAÇÃO_SIMPLES' || selectedDoc === 'DECLARAÇÃO_APROVEITAMENTO' || selectedDoc.includes('DECLARAÇÃO')) {
            filtered = classes.filter(c => c.nivel < currentLevel);
        } else if (selectedDoc === 'BOLETIM') {
            filtered = classes.filter(c => c.nivel <= currentLevel);
        } else if (selectedDoc === 'CERTIFICADO') {
            filtered = classes.filter(c => c.nivel === 13);
        }

        setAvailableClasses(filtered.sort((a, b) => b.nivel - a.nivel));
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

            const response = await api.post('/solicitacoes/', payload);
            let finalResult = response.data;

            if (userType === 'funcionario' && paymentMethod === 'confirmado_local') {
                const idSolicitacao = response.data.solicitacao.id_solicitacao;
                const confirmResponse = await api.post(`/solicitacoes/${idSolicitacao}/confirmar_pagamento/`, {
                    id_funcionario: user.id_funcionario || user.id
                });
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
                                        {loading ? '...' : <RiSearchLine />}
                                    </button>
                                </div>
                                {error && <p className={style.errorMsg}>{error}</p>}
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && studentInfo && (
                    <div className={style.stepIn}>
                        <h2>Confirmar Dados do Educando</h2>
                        <div className={style.confirmCard}>
                            <div className={style.studentSummary}>
                                <div className={style.avatar}>
                                    {studentInfo.img_path ? <img src={studentInfo.img_path} alt="" /> : <RiUser3Line />}
                                </div>
                                <div className={style.details}>
                                    <h3>{studentInfo.nome_completo}</h3>
                                    <p><strong>BI:</strong> {studentInfo.numero_bi}</p>
                                    <p><strong>Matrícula:</strong> {studentInfo.numero_matricula}</p>
                                    <p><strong>Actual:</strong> {studentInfo.classe_nivel || 'Classe N/A'}ª Classe - {studentInfo.curso_nome || 'Curso N/A'}</p>
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

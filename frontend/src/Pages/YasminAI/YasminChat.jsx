import { useState, useRef, useEffect } from 'react';
import style from './YasminChat.module.css';
import '../../assets/style/global.style.css';
import MenuNavBarCliente from '../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente';
import NavBarMenu from '../../Components/Elements/NavBarMenu/NavBarMenu';
import Header from '../../Components/Elements/Header/Header';
import {
    RiSendPlane2Fill,
    RiImageAddLine,
    RiMicLine,
    RiUser3Line,
} from 'react-icons/ri';
import { FaAtom } from 'react-icons/fa6';
import { useAuth } from '../../Context/AuthContext';
import yasminService from '../../Services/yasminService';

export default function YasminChat() {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (customInput = null) => {
        const textToSend = customInput || input;
        if (!textToSend.trim() || isTyping) return;

        const userMsg = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Determinar o papel (role) baseado no tipo de usuário
            const role = user?.tipo_usuario === 'aluno' ? 'student' : (user?.tipo_usuario === 'encarregado' ? 'parent' : 'admin');

            const response = await yasminService.sendMessage(textToSend, role, user?.id);

            const aiMsg = {
                role: 'ai',
                content: response.response || "Desculpe, tive um problema ao processar sua solicitação."
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Erro na Yasmin:", error);
            const errorMsg = {
                role: 'ai',
                content: "Olá! No momento estou tendo dificuldades de conexão com meus servidores de IA. Por favor, tente novamente em alguns instantes."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Determinar o tipo de usuário e layout
    const isStaff = user?.tipo_usuario === 'funcionario';

    // Normalizar o tipo para o MenuNavBarCliente
    let menuType = 'student';
    if (user?.tipo_usuario === 'aluno') menuType = 'student';
    else if (user?.tipo_usuario === 'encarregado') menuType = 'parent';

    // Classes de container baseadas no tipo de usuário
    const generalContainerClass = isStaff ? 'ContainerGeneral' : 'containelGeralclient';
    const mainContainerClass = isStaff ? 'ContainerMain' : 'containelMainclient';

    return (
        <div className={generalContainerClass}>
            {/*isStaff ? <MenuNavBarCliente user={menuType} /> : <NavBarMenu />*/}
            {user?.tipo_usuario === "funcionario" ? <NavBarMenu /> : <MenuNavBarCliente user={menuType} />}


            <main className={mainContainerClass}>
                <Header text1="Inteligência Artificial" text2="Yasmin" />

                <div className={style.yasminContainer}>
                    {/* Sidebar Interna de Chat (Opcional, optei por simplificar para focar no chat principal) */}
                    <div className={style.chatWrapper}>

                        <div className={style.messagesContainer}>
                            {messages.length === 0 ? (
                                <div className={style.emptyState}>
                                    <div className={style.logoLarge}>
                                        <FaAtom size={64} />
                                    </div>
                                    <div className={style.greeting}>
                                        <h2>Olá, {user?.nome?.split(' ')[0] || 'Humano'}</h2>
                                        <h2 className={style.textGradient}>Como posso ajudar hoje?</h2>
                                    </div>
                                    <div className={style.suggestionGrid}>
                                        <div className={style.suggestionCard} onClick={() => handleSend('Como consulto minhas notas?')}>
                                            <span>Consultar Notas</span>
                                            <small>Verificar aproveitamento</small>
                                        </div>
                                        <div className={style.suggestionCard} onClick={() => handleSend('Preciso de uma declaração')}>
                                            <span>Pedir Declaração</span>
                                            <small>Secretaria virtual</small>
                                        </div>
                                        <div className={style.suggestionCard} onClick={() => handleSend('Quando são os exames?')}>
                                            <span>Datas de Exames</span>
                                            <small>Calendário académico</small>
                                        </div>
                                        <div className={style.suggestionCard} onClick={() => handleSend('Falar com um humano')}>
                                            <span>Suporte</span>
                                            <small>Contactar secretaria</small>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`${style.messageRow} ${style[msg.role]}`}>
                                            <div className={`${style.msgAvatar} ${style[msg.role]}`}>
                                                {msg.role === 'ai' ? <FaAtom size={20} /> : <RiUser3Line size={20} />}
                                            </div>
                                            <div className={style.bubble}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className={`${style.messageRow} ${style.ai}`}>
                                            <div className={`${style.msgAvatar} ${style.ai}`}>
                                                <FaAtom size={20} className={style.rotating} />
                                            </div>
                                            <div className={style.bubble}>
                                                <div className={style.typingIndicator}>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <div className={style.inputContainer}>
                            <div className={style.inputWrapper}>
                                <button className={style.actionBtn}>
                                    <RiImageAddLine size={20} />
                                </button>
                                <textarea
                                    className={style.textInput}
                                    placeholder="Envie uma mensagem para Yasmin..."
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                {input.trim() ? (
                                    <button className={`${style.actionBtn} ${style.sendBtn}`} onClick={() => handleSend()}>
                                        <RiSendPlane2Fill size={20} />
                                    </button>
                                ) : (
                                    <button className={style.actionBtn}>
                                        <RiMicLine size={20} />
                                    </button>
                                )}
                            </div>
                            <p className={style.disclaimer}>
                                A Yasmin pode cometer erros. Verifique informações importantes.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

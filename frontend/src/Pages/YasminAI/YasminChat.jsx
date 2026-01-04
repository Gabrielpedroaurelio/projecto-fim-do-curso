import { useState, useRef, useEffect } from 'react';
// import { useLocation } from 'react-router-dom'; // Unused
import style from './YasminChat.module.css';
import {
    RiAddLine,
    RiChat1Line,
    RiMenuLine,
    RiMenuFoldLine,
    RiSendPlane2Fill,
    RiImageAddLine,
    RiMicLine,
    RiUser3Line,
    RiRobot2Line
} from 'react-icons/ri';
import { FaAtom } from 'react-icons/fa6';

export default function YasminChat() {
    // const location = useLocation(); // Unused for now
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial Mock History
    const history = [
        { id: 1, title: 'Ajuda com Notas' },
        { id: 2, title: 'Horário de Exames' },
        { id: 3, title: 'Declaração Escolar' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg = {
                role: 'ai',
                content: `Olá! Sou a Yasmin. Recebi sua mensagem: "${userMsg.content}". Como posso ajudar mais com questões escolares?`
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Responsive toggle logic check
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={style.layoutContainer}>
            {/* Sidebar */}
            <aside className={`${style.sidebar} ${!sidebarOpen ? style.closed : style.open}`}>
                <button className={style.newChatBtn} onClick={() => setMessages([])}>
                    <RiAddLine size={20} />
                    Novo Chat
                </button>

                <div className={style.historyList}>
                    <div className={style.historyGroup}>
                        <h4>Recente</h4>
                        {history.map(item => (
                            <div key={item.id} className={style.historyItem}>
                                <RiChat1Line />
                                {item.title}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style.userProfile}>
                    <div className={style.avatar}>U</div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Usuário</div>
                        <div style={{ fontSize: '0.75rem', color: '#8e9091' }}>Online</div>
                    </div>
                </div>
            </aside>

            {/* Chat Area */}
            <main className={style.chatArea}>
                <div className={style.topBar}>
                    <button className={style.toggleBtn} onClick={toggleSidebar}>
                        {sidebarOpen ? <RiMenuFoldLine size={24} /> : <RiMenuLine size={24} />}
                    </button>
                    <div className={style.modelSelector}>
                        Yasmin <FaAtom />
                    </div>
                    <div style={{ width: 40 }}></div> {/* Spacer */}
                </div>

                <div className={style.messagesContainer}>
                    {messages.length === 0 ? (
                        <div className={style.emptyState}>
                            <div className={style.logoLarge}>
                                <FaAtom size={64} color="#4285f4" />
                            </div>
                            <div className={style.greeting}>
                                <h2>Olá, Humano</h2>
                                <h2>Como posso ajudar hoje?</h2>
                            </div>
                            <div className={style.suggestionGrid}>
                                <div className={style.suggestionCard} onClick={() => setInput('Como consulto minhas notas?')}>
                                    <span>Consultar Notas</span>
                                    <small>Verificar aproveitamento</small>
                                </div>
                                <div className={style.suggestionCard} onClick={() => setInput('Preciso de uma declaração')}>
                                    <span>Pedir Declaração</span>
                                    <small>Secretaria virtual</small>
                                </div>
                                <div className={style.suggestionCard} onClick={() => setInput('Quando são os exames?')}>
                                    <span>Datas de Exames</span>
                                    <small>Calendário académico</small>
                                </div>
                                <div className={style.suggestionCard} onClick={() => setInput('Falar com um humano')}>
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
                                        <FaAtom size={20} />
                                    </div>
                                    <div className={style.bubble}>
                                        <span className="typing-dots">...</span>
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
                            <button className={`${style.actionBtn} ${style.sendBtn}`} onClick={handleSend}>
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
            </main>
        </div>
    );
}

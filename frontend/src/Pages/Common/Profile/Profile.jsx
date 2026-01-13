import React, { useState } from 'react';
import style from './Profile.module.css';
import '../../../assets/style/global.style.css';
import MenuNavBarCliente from '../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente';
import NavBarMenu from '../../../Components/Elements/NavBarMenu/NavBarMenu';
import Header from '../../../Components/Elements/Header/Header';
import { useAuth } from '../../../Context/AuthContext';
import api from '../../../Services/api';
import { RiUserLine, RiLockLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiImageEditLine, RiSaveLine } from 'react-icons/ri';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [rawImage, setRawImage] = useState(null);

    // Sidebar choice based on user type
    const Sidebar = user?.tipo === 'funcionario' ? NavBarMenu : MenuNavBarCliente;
    const sidebarProp = user?.tipo === 'funcionario' ? {} : { user: user?.tipo };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRawImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpdatePhoto = async () => {
        if (!rawImage) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('img_path', rawImage);

        try {
            const endpoint = user.tipo === 'funcionario' ? `/funcionarios/${user.id}/` :
                user.tipo === 'aluno' ? `/alunos/${user.id}/` :
                    `/encarregados/${user.id}/`;

            await api.patch(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Foto de perfil atualizada com sucesso! Recarregue para ver as mudanças.");
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar foto.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        setLoading(true);
        try {
            const endpoint = user.tipo === 'funcionario' ? `/funcionarios/${user.id}/` :
                user.tipo === 'aluno' ? `/alunos/${user.id}/` :
                    `/encarregados/${user.id}/`;

            await api.patch(endpoint, { senha_hash: passwordData.newPassword });
            alert("Senha atualizada com sucesso!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar senha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='containelGeralclient'>
            <Sidebar {...sidebarProp} />
            <main className='containelMainclient'>
                <Header text1="Minha Conta" text2="Perfil do Usuário" />

                <div className={style.profileGrid}>
                    {/* Informações Pessoais (Read-only) */}
                    <div className={style.card}>
                        <div className={style.profileInfoSide}>
                            <div className={style.avatarContainer}>
                                <div className={style.avatar}>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" />
                                    ) : user?.img_path ? (
                                        <img src={user.img_path} alt="Profile" />
                                    ) : (
                                        <RiUserLine size={64} />
                                    )}
                                    <label htmlFor="photo-upload" className={style.editOverlay}>
                                        <RiImageEditLine />
                                        <input type="file" id="photo-upload" hidden onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                                {rawImage && (
                                    <button onClick={handleUpdatePhoto} className={style.saveBtn} disabled={loading}>
                                        {loading ? '...' : 'Salvar Foto'}
                                    </button>
                                )}
                            </div>

                            <div className={style.mainInfo}>
                                <h1>{user?.nome}</h1>
                                <span>{user?.tipo?.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className={style.detailsGrid}>
                            <div className={style.detailItem}>
                                <RiMailLine />
                                <div>
                                    <label>Email</label>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                            {user?.tipo === 'aluno' && (
                                <div className={style.detailItem}>
                                    <RiUserLine />
                                    <div>
                                        <label>Nº Matrícula</label>
                                        <p>{user?.numero_matricula}</p>
                                    </div>
                                </div>
                            )}
                            {user?.tipo === 'funcionario' && (
                                <div className={style.detailItem}>
                                    <RiUserLine />
                                    <div>
                                        <label>Cargo</label>
                                        <p>{user?.cargo}</p>
                                    </div>
                                </div>
                            )}
                            <div className={style.detailItem}>
                                <RiMapPinLine />
                                <div>
                                    <label>Status</label>
                                    <p>{user?.status || 'Ativo'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Segurança (Editable) */}
                    <div className={style.card}>
                        <div className={style.cardHeader}>
                            <RiLockLine />
                            <h2>Alterar Senha</h2>
                        </div>
                        <form onSubmit={handleUpdatePassword} className={style.passwordForm}>
                            <div className={style.inputGroup}>
                                <label>Nova Senha</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                            <div className={style.inputGroup}>
                                <label>Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <button type="submit" className={style.submitBtn} disabled={loading}>
                                {loading ? 'Aguarde...' : 'Atualizar Credenciais'}
                                <RiSaveLine />
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;

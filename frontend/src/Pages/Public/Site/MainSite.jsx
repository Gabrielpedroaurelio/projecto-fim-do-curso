import MenuSitePublic from '../../../Components/Utils/MenuSitePublic/MenuSitePublic'
import style from './MainSite.module.css'
import img_escola01 from '../../../assets/images/escola01.jpg'
import { BiInfoCircle } from 'react-icons/bi'
import img_escola02 from '../../../assets/images/escola02.jpg'

import { FaBookOpen, FaDiscord, FaFacebook, FaInstagram, FaSchool, FaTelegram, FaTwitter, FaWhatsapp, FaYoutube,FaBrain,FaComputer, FaCalculator, FaChartGantt,FaNetworkWired } from 'react-icons/fa6'
import {AiOutlineBulb, AiOutlineRead, AiOutlineSketch, AiTwotoneBulb} from 'react-icons/ai'
import { Link } from 'react-router-dom'
export default function MainSite({ }) {
    return (
        <>
            <MenuSitePublic />
            <div className={style.banner}>
                <div className={style.img}>
                    <img src={img_escola01} alt="" />
                    <div className={style.wave}>
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className={style.shapefill}></path>
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className={style.shapefill}></path>
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className={style.shapefill}></path>
                        </svg>
                    </div>
                </div>
                <div className={style.img}>
                    <img src={img_escola02} alt="" />
                </div>
                <div className={style.context}>
                    <div>
                        <h1>INOVAÇÃO, CONHENCIMENTO & FUTURO</h1>
                        <p>
                            Bem-Vindo ao INSTITUTO POLITÉCNICO DO MAIOMBE
                        </p>
                    </div>
                </div>
            </div>
            <div className={style.site}>
                <div className={style.Content}>
                    <div>
                        <h1>SOBRE NÓS</h1>
                        <p>
                            Somos uma grande familia com o objectivo de garantir o desenvolvimento profissional dos nossos estudantes
                        </p>
                    </div>
                    <div>
                        <h1>MISSÃO & VISÃO</h1>
                        <p>
                            O nosso maior objectivo é garantir e assegurar o sucesso dos nossos alunos
                        </p>
                    </div>
                </div>
                <div className={style.OurValues}>
                    <div>
                        <span className={style.icon}><AiOutlineBulb size={40} /></span>
                        <span className={style.txt}>INOVAÇÃO</span>
                    </div>
                    <div>
                        <span className={style.icon}><AiOutlineRead size={40} /></span>
                        <span className={style.txt}>EXCELENCIA</span>
                    </div>
                    <div>
                        <span className={style.icon}><AiOutlineSketch size={40} /></span>
                        <span className={style.txt}>INTEGRIDADE</span>
                    </div>

                </div>
                <div className={style.OurCourse}>
                    <div className={style.Course}>
                        <div>
                            <FaComputer size={50} />
                        </div>
                        <h3>INFRMATICA DE GESTÃO</h3>
                    </div>
                    <div className={style.Course}>
                        <div>
                            <FaNetworkWired size={50} />
                        </div>
                        <h3>INFORMÁTICA</h3>
                    </div>
                    <div className={style.Course}>
                        <div>
                            <FaChartGantt size={50} />
                        </div>
                        <h3>GESTÃO EMPRESARIAL</h3>
                    </div>
                    <div className={style.Course}>
                        <div>
                            <FaCalculator size={50} />
                        </div>
                        <h3>CONTABILIDADE E GESTÃO</h3>
                    </div>
                </div>
                <div className={style.more}>
                    <div className={style.library}>
                        <div>
                            <FaBookOpen size={50} />
                        </div>
                        <div>
                            <h2>BIBLIOTECA ONLINE</h2>
                            <Link to='public/library'>EXPLORAR A BIBLIOTECA </Link>
                        </div>
                    </div>
                    <div className={style.infraestrutura}>
                        <div>
                            <img src={img_escola01} alt="" />
                        </div>
                        <div>
                            <img src={img_escola01} alt="" />
                        </div>
                        <div>
                            <img src={img_escola01} alt="" />
                        </div>
                    </div>

                </div>
                <footer>
                    <div className={style.Contacts}>
                        <h3>CONTACTOS</h3>
                        <a href="">932 432 894</a>
                        <a href="">945 651 150</a>
                        <a href="">institutopolitecnicodomaiombe@gmail.com</a>
                    </div>
                    <div className={style.social_network}>
                        <h3>REDES SOCIAIS</h3>
                        <div>
                            <a href=""><FaWhatsapp /></a>
                            <a href=""><FaFacebook /></a>
                            <a href=""><FaInstagram /></a>
                            <a href=""><FaTwitter /></a>
                            <a href=""><FaDiscord /></a>
                            <a href=""><FaTelegram /></a>
                            <a href=""><FaYoutube /></a>
                        </div>
                    </div>
                </footer>
                <p className={style.footer}>&copy; IPM 2025 Todos os Direitos Reservados</p>
            </div>
        </>
    )
}
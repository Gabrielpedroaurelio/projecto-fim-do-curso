import React from 'react';
import style from './DashboardsStudents.module.css';
// padrão para todas as paginas
import '../../../../assets/style/global.style.css'
import { Link } from 'react-router-dom'
import MenuNavBarCliente from '../../../../Components/Elements/MenuNavBarCliente/MenuNavBarCliente'
import Cards from '../../../../Components/Elements/Cards/Cards'
import { RiBillLine } from 'react-icons/ri'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import CardsDocments from '../../../../Components/Elements/CardsDocuments/CardsDocuments';
//dados ficticios para o grafico
const revenueData = [
  { name: 'Mat', value: 9 },
  { name: 'PT', value: 15 },
  { name: 'TLP', value: 20 },
  { name: 'TREI', value: 19 },
  { name: 'Port', value: 15 },
  { name: 'Ing', value: 18 },
  { name: 'Fisica', value: 15 },
  { name: 'Eletro', value: 14 },
  { name: 'BD', value: 20 },
  { name: 'Vida', value: 18 },
  { name: 'Empreend', value: 18 },
  { name: 'FAI', value: 10 },
];
const DashboardsStudents = () => {


  return (
    < div className='containelGeralclient'>
      <MenuNavBarCliente user={'student'}></MenuNavBarCliente>
      <main className='containelMainclient'>
        <div className={style.gridCards}>

          <Cards icon={<RiBillLine />} title={"Total Solicitações"} value={"Kz 80,768"} value_percentual={54.8}  />
          <Cards icon={<RiBillLine />} title={"Resumo do Trimestre"} value={"Média 14.6"} value_percentual={6.8} />
          <Cards icon={<RiBillLine />} title={"Faltas"} value={"5"} value_percentual={58} />
          <Cards icon={<RiBillLine />} title={""} value={"5"} value_percentual={58} />

        </div>
        <div className={style.cardDocuments}>
          <h2>Solicitar Documentos</h2>
          <div className={style.gridCards}>
       
              <CardsDocments text={"Declaraçao"} icon={<RiBillLine/>}/>
              <CardsDocments text={"Certificado"} icon={<RiBillLine/>}/>
              <CardsDocments text={"Boletim"} icon={<RiBillLine/>}/>
        
          </div>
        </div>
        <div className={style.cardChart}>
          <h1>Grafico de Comparação</h1>
          <div className={`h-[300px] w-[90%] ${style.chart}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffffff', border: '1px solid #00b5b8ff', borderRadius: '8px' }}
                  itemStyle={{ color: '#000000ff' }}
                  cursor={{ fill: '#ffffffff' }}
                />
                <Bar dataKey="value" fill="#2277ffff" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardsStudents;
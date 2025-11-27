import React from "react";
import style from "./DashboardEncarregado.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardEncarregado() {
  // Dados fictícios dos filhos
  const filhos = [
    {
      id: 1,
      nome: "João Silva",
      turma: "10º A",
      media: 85,
      faltas: 2,
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      turma: "9º B",
      media: 92,
      faltas: 0,
    },
  ];

  return (
    <div className={style.ContainerDashboard}>
      <h1 className={style.Title}>Bem-vindo ao seu painel</h1>
      <div className={style.FilhosContainer}>
        {filhos.map((filho) => (
          <div key={filho.id} className={style.CardFilho}>
            <h2>{filho.nome}</h2>
            <p><strong>Turma:</strong> {filho.turma}</p>
            <p><strong>Média:</strong> {filho.media}%</p>
            <p><strong>Faltas:</strong> {filho.faltas}</p>
            <div className={style.Actions}>
              <button>Solicitar Documento</button>
              <button>Ver Histórico</button>
            </div>

            <div className={style.Chart}>
              <Bar
                data={{
                  labels: ["Prova 1", "Prova 2", "Prova 3", "Trabalho"],
                  datasets: [
                    {
                      label: "Notas",
                      data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                      ],
                      backgroundColor: "rgba(25, 135, 84, 0.7)",
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, max: 100 },
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

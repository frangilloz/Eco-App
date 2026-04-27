import { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  Info,
} from 'lucide-react';

const QUESTIONS = [
  { id: 1, cat: 'Dignidad', q: '¿Cuál es la brecha salarial máxima (sueldo más alto vs. más bajo)?', options: [{ t: 'Menos de 1:5', p: 10 }, { t: 'Entre 1:5 y 1:10', p: 5 }, { t: 'Más de 1:15', p: 0 }] },
  { id: 2, cat: 'Dignidad', q: '¿Se respeta el derecho a la desconexión digital?', options: [{ t: 'Sí, por política estricta', p: 10 }, { t: 'A veces hay excepciones', p: 5 }, { t: 'Disponibilidad 24/7', p: 0 }] },
  { id: 3, cat: 'Dignidad', q: '¿Existe flexibilidad horaria real y fomento del teletrabajo?', options: [{ t: 'Total (100% flexible)', p: 10 }, { t: 'Híbrido controlado', p: 5 }, { t: 'Presencialismo obligatorio', p: 0 }] },
  { id: 4, cat: 'Solidaridad', q: '¿Contribuye la empresa activamente a proyectos Open Source o sociales?', options: [{ t: 'Sí, con recursos y tiempo', p: 10 }, { t: 'Aportaciones puntuales', p: 5 }, { t: 'Sin contribuciones', p: 0 }] },
  { id: 5, cat: 'Solidaridad', q: '¿Se priorizan proveedores locales o éticos en las compras?', options: [{ t: 'Más del 60%', p: 10 }, { t: 'Entre el 20% y 60%', p: 5 }, { t: 'Menos del 20%', p: 0 }] },
  { id: 6, cat: 'Solidaridad', q: '¿Existen planes de formación continua subvencionados?', options: [{ t: 'Sí, presupuesto asignado', p: 10 }, { t: 'Formaciones puntuales', p: 5 }, { t: 'Sin formación', p: 0 }] },
  { id: 7, cat: 'Ecología', q: '¿Utiliza la empresa servidores con energía renovable o Green IT?', options: [{ t: 'Sí, certificado 100%', p: 10 }, { t: 'Parcialmente', p: 5 }, { t: 'No se tiene en cuenta', p: 0 }] },
  { id: 8, cat: 'Ecología', q: '¿Existe una política de reparación y reutilización de hardware?', options: [{ t: 'Se repara y dona', p: 10 }, { t: 'Se recicla en punto limpio', p: 5 }, { t: 'Se tira o acumula', p: 0 }] },
  { id: 9, cat: 'Ecología', q: '¿La oficina aplica medidas de ahorro energético y reducción de residuos?', options: [{ t: 'Auditoría activa', p: 10 }, { t: 'Medidas básicas', p: 5 }, { t: 'Sin medidas', p: 0 }] },
  { id: 10, cat: 'Justicia', q: '¿Se auditan los algoritmos e IAs para evitar sesgos de género o raza?', options: [{ t: 'Auditoría ética periódica', p: 10 }, { t: 'Se revisa si hay errores', p: 5 }, { t: 'No se auditan', p: 0 }] },
  { id: 11, cat: 'Justicia', q: '¿Existe igualdad de oportunidades real en los puestos directivos?', options: [{ t: 'Paridad total (50/50)', p: 10 }, { t: 'Alguna mujer en directiva', p: 5 }, { t: 'Dirección monocolor', p: 0 }] },
  { id: 12, cat: 'Justicia', q: '¿Se prohíben contratos con sectores poco éticos (armas, paraísos)?', options: [{ t: 'Sí, por código ético', p: 10 }, { t: 'Se evalúa caso a caso', p: 5 }, { t: 'Se prioriza el beneficio', p: 0 }] },
  { id: 13, cat: 'Transparencia', q: '¿Hay transparencia sobre situación financiera y reparto de beneficios?', options: [{ t: 'Total transparencia', p: 10 }, { t: 'Información limitada', p: 5 }, { t: 'Opacidad total', p: 0 }] },
  { id: 14, cat: 'Transparencia', q: '¿Participan los empleados en decisiones estratégicas?', options: [{ t: 'Voto democrático/Asamblea', p: 10 }, { t: 'Consulta no vinculante', p: 5 }, { t: 'Solo decide gerencia', p: 0 }] },
  { id: 15, cat: 'Transparencia', q: '¿Cómo gestiona la empresa los datos de sus clientes y usuarios?', options: [{ t: 'Soberanía del dato proactiva', p: 10 }, { t: 'Mínimo legal (RGPD)', p: 5 }, { t: 'Monetización activa', p: 0 }] },
];

export default function App() {
  const [answers, setAnswers] = useState<Record<number, number>>(() =>
    JSON.parse(localStorage.getItem('eco-audit-data') || '{}')
  );
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem('eco-audit-data', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (points: number) => {
    setAnswers({ ...answers, [step]: points });
    setStep(step + 1);
  };

  const categories = ['Dignidad', 'Solidaridad', 'Ecología', 'Justicia', 'Transparencia'];
  
  const radarData = categories.map(catName => {
    const catQuestions = QUESTIONS.filter(q => q.cat === catName);
    const sum = catQuestions.reduce((acc, q) => {
      const idx = QUESTIONS.indexOf(q);
      return acc + (answers[idx] || 0);
    }, 0);
    return {
      subject: catName,
      A: sum / catQuestions.length,
      fullMark: 10,
    };
  });

  if (step >= QUESTIONS.length) {
    const getAdvice = () => {
      const advice: string[] = [];
      if (radarData.find(d => d.subject === 'Ecología')!.A < 7) advice.push("🌿 Green IT: Migrar a servidores cloud con energía renovable.");
      if (radarData.find(d => d.subject === 'Dignidad')!.A < 7) advice.push("🧘 Bienestar: Implementar el derecho estricto a la desconexión digital.");
      if (radarData.find(d => d.subject === 'Solidaridad')!.A < 7) advice.push("🤝 Comunidad: Fomentar el aporte al Software Libre en horas laborales.");
      if (radarData.find(d => d.subject === 'Justicia')!.A < 7) advice.push("⚖️ Ética: Realizar auditorías de sesgos en vuestros algoritmos e IA.");
      if (radarData.find(d => d.subject === 'Transparencia')!.A < 7) advice.push("📢 Democracia: Crear canales de participación en decisiones estratégicas.");
      return advice.length > 0 ? advice : ["✨ ¡Sois un modelo de empresa EBC!"];
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Informe de Impacto</h1>
          </div>
          <div className="h-72 w-full mb-8">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13 }} />
                <Radar dataKey="A" stroke="#16a34a" fill="#22c55e" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mb-8">
            <h2 className="flex items-center gap-2 font-bold text-gray-700 underline decoration-green-300">
              <Lightbulb size={20} className="text-yellow-500" /> Recomendaciones:
            </h2>
            {getAdvice().map((txt, i) => (
              <div key={i} className="p-3 bg-green-50 text-green-800 rounded-lg text-sm border-l-4 border-green-500">{txt}</div>
            ))}
          </div>
          <button onClick={() => { setStep(0); setAnswers({}); }} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-black">
            <RotateCcw size={18} /> Nueva Evaluación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <p className="text-green-600 font-bold text-sm uppercase tracking-widest">Auditoría en curso</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Eco-Audit EBC</h2>
          </div>
          <span className="text-gray-400 font-mono">{step + 1}/{QUESTIONS.length}</span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 mb-6">
          <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed">{QUESTIONS[step].q}</p>
          <div className="grid gap-3">
            {QUESTIONS[step].options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.p)} className="flex items-center justify-between p-5 w-full bg-white border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all group">
                <span className="font-semibold text-gray-600 group-hover:text-green-700">{opt.t}</span>
                <ChevronRight className="text-gray-300 group-hover:text-green-500" />
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm flex items-center justify-center gap-1"><Info size={14} /> Los datos se guardan en el navegador.</p>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { BarChart3, ChevronRight, RotateCcw, Lightbulb, Info, Play, ShieldCheck, Leaf } from 'lucide-react';

// 1. MATRIZ EBC (15 Preguntas)
const QUESTIONS = [
  { id: 1, cat: 'Dignidad', q: '¿Cuál es la brecha salarial máxima?', options: [{ t: 'Menos de 1:5', p: 10 }, { t: 'Entre 1:5 y 1:10', p: 5 }, { t: 'Más de 1:15', p: 0 }] },
  { id: 2, cat: 'Dignidad', q: '¿Se respeta el derecho a la desconexión digital?', options: [{ t: 'Sí, por política estricta', p: 10 }, { t: 'A veces hay excepciones', p: 5 }, { t: 'Disponibilidad 24/7', p: 0 }] },
  { id: 3, cat: 'Dignidad', q: '¿Existe flexibilidad horaria real y fomento del teletrabajo?', options: [{ t: 'Total (100% flexible)', p: 10 }, { t: 'Híbrido controlado', p: 5 }, { t: 'Presencialismo obligatorio', p: 0 }] },
  { id: 4, cat: 'Solidaridad', q: '¿Contribuye la empresa activamente a proyectos Open Source?', options: [{ t: 'Sí, con recursos y tiempo', p: 10 }, { t: 'Aportaciones puntuales', p: 5 }, { t: 'Sin contribuciones', p: 0 }] },
  { id: 5, cat: 'Solidaridad', q: '¿Se priorizan proveedores locales o éticos en las compras?', options: [{ t: 'Más del 60%', p: 10 }, { t: 'Entre el 20% y 60%', p: 5 }, { t: 'Menos del 20%', p: 0 }] },
  { id: 6, cat: 'Solidaridad', q: '¿Existen planes de formación continua subvencionados?', options: [{ t: 'Sí, presupuesto asignado', p: 10 }, { t: 'Formaciones puntuales', p: 5 }, { t: 'Sin formación', p: 0 }] },
  { id: 7, cat: 'Ecología', q: '¿Utiliza la empresa servidores con energía renovable o Green IT?', options: [{ t: 'Sí, certificado 100%', p: 10 }, { t: 'Parcialmente', p: 5 }, { t: 'No se tiene en cuenta', p: 0 }] },
  { id: 8, cat: 'Ecología', q: '¿Existe una política de reparación y reutilización de hardware?', options: [{ t: 'Se repara y dona', p: 10 }, { t: 'Se recicla en punto limpio', p: 5 }, { t: 'Se tira o acumula', p: 0 }] },
  { id: 9, cat: 'Ecología', q: '¿La oficina aplica medidas de ahorro energético y reducción de residuos?', options: [{ t: 'Auditoría activa', p: 10 }, { t: 'Medidas básicas', p: 5 }, { t: 'Sin medidas', p: 0 }] },
  { id: 10, cat: 'Justicia', q: '¿Se auditan los algoritmos e IAs para evitar sesgos de género o raza?', options: [{ t: 'Auditoría ética periódica', p: 10 }, { t: 'Se revisa si hay errores', p: 5 }, { t: 'No se auditan', p: 0 }] },
  { id: 11, cat: 'Justicia', q: '¿Existe igualdad de oportunidades real en los puestos directivos?', options: [{ t: 'Paridad total (50/50)', p: 10 }, { t: 'Alguna mujer en directiva', p: 5 }, { t: 'Dirección monocolor', p: 0 }] },
  { id: 12, cat: 'Justicia', q: '¿Se prohíben contratos con sectores poco éticos', options: [{ t: 'Sí, por código ético', p: 10 }, { t: 'Se evalúa caso a caso', p: 5 }, { t: 'Se prioriza el beneficio', p: 0 }] },
  { id: 13, cat: 'Transparencia', q: '¿Hay transparencia sobre situación financiera y reparto de beneficios?', options: [{ t: 'Total transparencia', p: 10 }, { t: 'Información limitada', p: 5 }, { t: 'Opacidad total', p: 0 }] },
  { id: 14, cat: 'Transparencia', q: '¿Participan los empleados en decisiones estratégicas?', options: [{ t: 'Voto democrático/Asamblea', p: 10 }, { t: 'Consulta no vinculante', p: 5 }, { t: 'Solo decide gerencia', p: 0 }] },
  { id: 15, cat: 'Transparencia', q: '¿Cómo gestiona la empresa los datos de sus clientes y usuarios?', options: [{ t: 'Soberanía del dato proactiva', p: 10 }, { t: 'Mínimo legal (RGPD)', p: 5 }, { t: 'Monetización activa', p: 0 }] },
];

export default function App() {
  const [view, setView] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [answers, setAnswers] = useState<Record<number, number>>(() =>
    JSON.parse(localStorage.getItem('eco-audit-data') || '{}')
  );
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem('eco-audit-data', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (points: number) => {
    setAnswers({ ...answers, [step]: points });
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setView('results');
    }
  };

  const categories = ['Dignidad', 'Solidaridad', 'Ecología', 'Justicia', 'Transparencia'];
  const radarData = categories.map(catName => {
    const catQuestions = QUESTIONS.filter(q => q.cat === catName);
    const sum = catQuestions.reduce((acc, q) => {
      const idx = QUESTIONS.indexOf(q);
      return acc + (answers[idx] || 0);
    }, 0);
    return { subject: catName, A: sum / catQuestions.length, fullMark: 10 };
  });

  // PANTALLA DE BIENVENIDA
  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-green-600 p-12 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-10 h-10" />
              <span className="font-bold tracking-tighter text-xl uppercase italic">Consultoría EBC</span>
            </div>
            <h1 className="text-5xl font-black leading-tight mb-4 text-balance">
              Mide el impacto real de tu empresa tecnológica.
            </h1>
            <p className="text-green-100 text-lg max-w-xl font-medium">
              Realiza una auditoría basada en la Economía del Bien Común para descubrir tu nivel de ética, sostenibilidad y justicia social.
            </p>
          </div>
          <div className="p-12 grid md:grid-cols-2 gap-8 bg-white">
            <div className="space-y-4">
              <h3 className="text-slate-800 font-bold text-xl flex items-center gap-2">
                <ShieldCheck className="text-green-500" /> ¿Qué analizamos?
              </h3>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li>• Huella de carbono y Green IT</li>
                <li>• Ética en algoritmos e IA</li>
                <li>• Democracia y transparencia interna</li>
                <li>• Brecha salarial y bienestar</li>
              </ul>
            </div>
            <div className="flex flex-col justify-end">
              <button 
                onClick={() => setView('quiz')}
                className="group bg-slate-900 text-white p-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl hover:-translate-y-1"
              >
                Comenzar Auditoría <Play className="fill-white w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE RESULTADOS
  if (view === 'results') {
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-3xl w-full border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <BarChart3 className="text-green-600 w-8 h-8" /> Informe de Consultoría
            </h1>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
              Análisis Completado
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                  <Radar dataKey="A" stroke="#16a34a" fill="#22c55e" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-bold text-slate-700 text-lg">
                <Lightbulb size={24} className="text-yellow-500" /> Plan de Acción:
              </h2>
              {getAdvice().map((txt, i) => (
                <div key={i} className="p-4 bg-slate-50 text-slate-700 rounded-xl text-sm border-l-4 border-green-500 font-medium leading-snug">
                  {txt}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => { setStep(0); setAnswers({}); setView('intro'); }} className="mt-12 w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
            <RotateCcw size={20} /> Reiniciar Auditoría
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA DE CUESTIONARIO
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-10 flex justify-between items-center px-4">
          <div>
            <p className="text-green-600 font-bold text-sm uppercase tracking-widest mb-1">{QUESTIONS[step].cat}</p>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Auditoría en Curso</h2>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-slate-200">{step + 1}</span>
            <span className="text-slate-400 font-bold">/{QUESTIONS.length}</span>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 transform transition-all">
          <p className="text-2xl text-slate-800 font-bold mb-10 leading-relaxed">
            {QUESTIONS[step].q}
          </p>
          <div className="grid gap-4">
            {[...QUESTIONS[step].options].sort((a, b) => a.t.localeCompare(b.t)).map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.p)} className="flex items-center justify-between p-6 w-full bg-white border-2 border-slate-100 rounded-2xl hover:border-green-500 hover:bg-green-50 hover:scale-[1.02] transition-all group">
                <span className="font-bold text-slate-600 group-hover:text-green-700 text-lg text-left">{opt.t}</span>
                <ChevronRight className="text-slate-300 group-hover:text-green-500 w-6 h-6" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
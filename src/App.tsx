import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, TrendingUp, Users, ChevronRight, CheckCircle2,
  BadgeDollarSign, Rocket, Handshake, Eye, Star, ArrowRight,
  Clock, Award, Zap, Building2, Globe, MessageCircle,
  ChevronDown, Play, Lock, Quote, BarChart3, Target, X, AlertTriangle
} from 'lucide-react';

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function AnimatedCounter({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString('pt-BR')}{suffix}</span>;
}

const RECENT_INVESTMENTS = [
  { name: 'Marcos T.', city: 'SP', amount: 'R$ 85.000', biz: 'App de saúde' },
  { name: 'Juliana R.', city: 'RJ', amount: 'R$ 120.000', biz: 'E-commerce' },
  { name: 'André L.', city: 'MG', amount: 'R$ 50.000', biz: 'Restaurante' },
  { name: 'Bianca S.', city: 'PR', amount: 'R$ 200.000', biz: 'FinTech' },
  { name: 'Thiago M.', city: 'SC', amount: 'R$ 75.000', biz: 'Agência' },
  { name: 'Carla F.', city: 'BA', amount: 'R$ 100.000', biz: 'Clínica' },
  { name: 'Diego P.', city: 'RS', amount: 'R$ 60.000', biz: 'Loja online' },
  { name: 'Patrícia V.', city: 'PE', amount: 'R$ 150.000', biz: 'EdTech' },
];

function LiveNotification() {
  const [notif, setNotif] = useState<typeof RECENT_INVESTMENTS[0] | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const indexRef = useRef(0);
  const showNext = useCallback(() => {
    if (dismissed) return;
    const item = RECENT_INVESTMENTS[indexRef.current % RECENT_INVESTMENTS.length];
    setNotif(item);
    setVisible(true);
    indexRef.current++;
    setTimeout(() => { setVisible(false); }, 4000);
  }, [dismissed]);
  useEffect(() => {
    if (dismissed) return;
    const initial = setTimeout(showNext, 8000);
    const interval = setInterval(showNext, 25000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [showNext, dismissed]);
  if (dismissed || !notif || !visible) return null;
  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs notification-slide">
      <div className="glass rounded-xl p-3 pr-8 shadow-2xl border-l-4 border-teal-400">
        <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {notif.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{notif.name} de {notif.city}</p>
            <p className="text-teal-400 text-xs font-bold">{notif.amount} — {notif.biz}</p>
            <p className="text-slate-500 text-[10px]">Investimento recebido agora</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileStickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10 px-4 py-3">
      <a href="#oferta" className="btn-cta-gold text-slate-900 w-full py-3.5 rounded-full font-black text-sm flex items-center justify-center gap-2">
        GARANTIR MEU ACESSO POR R$97 <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function UrgencyBar() {
  const [spots, setSpots] = useState(47);
  useEffect(() => {
    const interval = setInterval(() => { setSpots(prev => prev > 12 ? prev - 1 : prev); }, 45000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse flex-shrink-0" />
        <span className="truncate">Vagas restantes:</span>
        <span className="bg-white text-red-600 px-2 py-0.5 rounded font-black text-sm sm:text-base">{spots}</span>
        <span className="hidden sm:inline">de 200 — Inscrição encerra em breve</span>
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <nav className={`fixed top-10 sm:top-9 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl py-3' : 'py-4 sm:py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-white font-bold text-base sm:text-lg">InvestConnect<span className="text-teal-400">BR</span></span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm text-slate-300">
          <a href="#como-funciona" className="hover:text-teal-400 transition-colors">Como Funciona</a>
          <a href="#história" className="hover:text-teal-400 transition-colors">Nossa História</a>
          <a href="#depoimentos" className="hover:text-teal-400 transition-colors">Depoimentos</a>
          <a href="#investidores" className="hover:text-teal-400 transition-colors">Investidores</a>
        </div>
        <a href="#oferta" className="btn-cta text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-1.5">
          Receber Investimento <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="bg-dark-gradient relative min-h-screen flex items-center pt-28 sm:pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 hero-grid-pattern opacity-40" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-teal-300 text-xs sm:text-sm font-medium">Conexão direta com investidores do Shark Tank USA</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.08] mb-5 sm:mb-6">
          <span className="text-gradient-hero">Receba Até</span>
          <br />
          <span className="text-gradient-gold">R$ 100.000</span>
          <br />
          <span className="text-gradient-hero">Para Criar Seu Negócio</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Você assiste o Shark Tank e pensa <span className="text-amber-400 font-bold">"eu queria ter essa chance"</span>?
          Agora você tem. Centenas de investidores estão procurando brasileiros como você para financiar com até R$100.000.
          <span className="text-white font-semibold"> Sem experiência prévia. Sem burocracia. Só a sua ideia e a vontade.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-12">
          <a href="#oferta" className="btn-cta-gold text-slate-900 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black text-base sm:text-lg flex items-center gap-2 pulse-glow-gold w-full sm:w-auto justify-center">
            QUERO RECEBER MEU INVESTIMENTO
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a href="#como-funciona" className="text-slate-300 hover:text-white flex items-center gap-2 transition-colors group">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-slate-600 group-hover:border-teal-400 flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
            </span>
            <span className="font-medium text-sm sm:text-base">Veja Como Funciona</span>
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg sm:max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white"><AnimatedCounter end={847} suffix="+" /></div>
            <div className="text-slate-400 text-xs sm:text-sm mt-1">Investidores Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-400">R$ <AnimatedCounter end={23} suffix="M+" /></div>
            <div className="text-slate-400 text-xs sm:text-sm mt-1">Já Investidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-teal-400"><AnimatedCounter end={312} suffix="+" /></div>
            <div className="text-slate-400 text-xs sm:text-sm mt-1">Negócios Financiados</div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 animate-bounce">
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500 mx-auto" />
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const investments = [
    'R$ 80.000 — Café Especial — SP', 'R$ 100.000 — App de Delivery — RJ',
    'R$ 45.000 — E-commerce Sustentável — MG', 'R$ 150.000 — HealthTech — PR',
    'R$ 60.000 — Clínica Veterinária — BA', 'R$ 200.000 — EdTech — SC',
    'R$ 35.000 — Loja de Roupas — PE', 'R$ 120.000 — SaaS B2B — RS',
    'R$ 75.000 — Restaurante — GO', 'R$ 90.000 — Agência Digital — CE',
    'R$ 55.000 — Produtos Naturais — AM', 'R$ 180.000 — FinTech — SP',
  ];
  return (
    <div className="bg-slate-900 border-y border-slate-800 py-3 sm:py-4 overflow-hidden">
      <div className="flex ticker-scroll">
        {[...investments, ...investments].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 sm:px-8 whitespace-nowrap">
            <BadgeDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-slate-300 font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialProof() {
  const { ref, isVisible } = useInView();
  return (
    <section ref={ref} className="bg-section-dark py-14 sm:py-16">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-center text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-6 sm:mb-8">Gente como você que já recebeu</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { name: 'Lucas M.', city: 'São Paulo', amount: 'R$ 80.000', biz: 'App de delivery', verb: 'conseguiu' },
            { name: 'Camila R.', city: 'Rio de Janeiro', amount: 'R$ 100.000', biz: 'Café especial', verb: 'recebeu' },
            { name: 'Rafael S.', city: 'Belo Horizonte', amount: 'R$ 45.000', biz: 'E-commerce', verb: 'fechou' },
            { name: 'Ana P.', city: 'Curitiba', amount: 'R$ 150.000', biz: 'HealthTech', verb: 'conquistou' },
            { name: 'Pedro H.', city: 'Salvador', amount: 'R$ 60.000', biz: 'Clínica vet.', verb: 'abriu com' },
            { name: 'Juliana F.', city: 'Florianopolis', amount: 'R$ 200.000', biz: 'EdTech', verb: 'escalou com' },
            { name: 'Carlos E.', city: 'Recife', amount: 'R$ 35.000', biz: 'Moda sustentável', verb: 'lançou com' },
            { name: 'Fernanda L.', city: 'Porto Alegre', amount: 'R$ 120.000', biz: 'SaaS B2B', verb: 'tirou do papel com' },
          ].map((p, i) => (
            <div key={i} className="glass rounded-xl p-3 sm:p-4 card-hover">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold text-xs sm:text-sm truncate">{p.name}</div>
                  <div className="text-slate-500 text-[10px] sm:text-xs truncate">{p.city}</div>
                </div>
              </div>
              <div className="text-teal-400 font-black text-base sm:text-lg">{p.amount}</div>
              <div className="text-slate-400 text-[10px] sm:text-xs">{p.verb} {p.biz}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  const { ref, isVisible } = useInView();
  return (
    <section id="história" ref={ref} className="bg-dark-gradient py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block bg-amber-500/10 text-amber-400 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4">A História Por Trás</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Por Quê Investidores Estão <span className="text-gradient-gold">Despejando Milhões</span> em Brasileiros Comuns?
          </h2>
        </div>

        <div className="space-y-5 sm:space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg">
          <p>
            Você sabe aquela sensação quando assiste o Shark Tank e pensa: <span className="text-amber-400 font-semibold">"Caramba, eu teria uma ideia melhor que essa"</span>?
            Pois é. Agora imagine o seguinte: os investidores também pensam assim. Eles sabem que o Brasil está cheio de gente como você.
          </p>
          <div className="glass rounded-2xl p-5 sm:p-6 border-l-4 border-teal-400 my-6 sm:my-8">
            <p className="text-white font-semibold text-lg sm:text-xl">
              "O Brasil não tem falta de talento. Tem falta de acesso. Gente brilhante morrendo de vontade de empreender e ninguém pra olhar e dizer: eu acredito nisso — toma o dinheiro."
            </p>
          </div>
          <p>
            Em 2023, um grupo de <span className="text-amber-400 font-semibold">fundos de investimento, investidores-anjo e olheiros do Shark Tank</span> decidiu mudar isso.
            Eles viram um dado absurdo: <span className="text-teal-400 font-semibold">97% dos brasileiros que querem empreender nunca conseguem financiamento. </span>
            Não é que falta ideia. Falta conexão.
          </p>
          <p>
            Foi aí que nasceu a <span className="text-white font-bold">InvestConnect BR</span> —
            a plataforma que coloca você, brasileiro com uma ideia, diretamente na frente de centenas de investidores que <span className="text-amber-400 font-bold">estão pedindo pra encontrar o próximo grande negócio.</span>
          </p>
          <p>
            Hoje são <span className="text-amber-400 font-bold">847+ investidores</span> cadastrados.
            E aqui vem o que é mais surpreende: <span className="text-white font-semibold">eles estão preferindo ideias simples. </span>
            Por quê? Porque negócio simples dão certo mais rápido. Um café, uma loja online, uma clínica — coisas que você já pensou em abrir.
            <span className="text-teal-400 font-semibold"> Você não precisa inventar o Uber. Você precisa de vontade e de alguém que acredite em você.</span>
          </p>
          <div className="glass rounded-2xl p-5 sm:p-6 border-l-4 border-amber-400">
            <p className="text-slate-300 text-sm sm:text-base">
              <span className="text-amber-400 font-bold">Pense nisso:</span> quantas vezes você teve uma ideia e não fez nada porque não tinha dinheiro?
              E se tivesse tido alguém disposto a colocar R$100.000 na sua mão? Sua vida seria diferente hoje.
              <span className="text-white font-semibold"> Essa pessoa existe. Ela está na plataforma esperando por você.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { ref, isVisible } = useInView();
  const steps = [
    { icon: <Users className="w-6 h-6 sm:w-7 sm:h-7" />, num: '01', title: 'Acesse a Plataforma', desc: 'Em minutos você já está dentro. Centenas de investidores-anjo, fundos e olheiros do Shark Tank estão lá TODOS os dias buscando projetos como o seu. Eles vem até você.' },
    { icon: <Target className="w-6 h-6 sm:w-7 sm:h-7" />, num: '02', title: 'Apresente Seu Projeto', desc: 'Não precisa ser perfeito. Um café, um app, uma loja — descreva sua ideia. Investidores buscam potencial e vontade, não pitch profissional. A plataforma te guia passo a passo.' },
    { icon: <Handshake className="w-6 h-6 sm:w-7 sm:h-7" />, num: '03', title: 'Receba Lances de Investimento', desc: 'Investidores veem seu projeto e fazem lances. Você pode receber múltiplos lances e escolher o melhor. Até R$100.000 ou mais. Você decide.' },
    { icon: <Rocket className="w-6 h-6 sm:w-7 sm:h-7" />, num: '04', title: 'Lance Seu Negócio', desc: 'Com o capital recebido, você transforma sua ideia em realidade. E o investidor continua do seu lado — com mentoria e suporte pra você crescer.' },
  ];
  return (
    <section id="como-funciona" ref={ref} className="bg-section-dark py-16 sm:py-20 relative">
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-teal-500/10 text-teal-400 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4">Simples e Rápido</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            Como Você Vai Receber <span className="text-gradient-gold">Até R$100.000</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-2">4 passos entre você e o investimento que pode mudar tudo</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {steps.map((s, i) => (
            <div key={i} className={`glass rounded-2xl p-4 sm:p-6 card-hover relative group ${i < 3 ? 'step-connector' : ''}`}>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-4xl sm:text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors">{s.num}</div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-400/20 to-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 sm:mb-4">{s.icon}</div>
              <h3 className="text-white font-bold text-sm sm:text-xl mb-1.5 sm:mb-3">{s.title}</h3>
              <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorTypes() {
  const { ref, isVisible } = useInView();
  const types = [
    { icon: <BadgeDollarSign className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Investidores-Anjo', desc: 'Empresários de sucesso que investem capital próprio em quem está começando. Eles já construíram negócios — agora querem construir o seu junto.', count: '420+' },
    { icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Fundos de Investimento', desc: 'Fundos com capital de milhões especificamente alocado para novos negócios brasileiros. Eles PRECISAM investir — e estão buscando ativamente.', count: '85+' },
    { icon: <Eye className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Olheiros do Shark Tank', desc: 'Profissionais que trabalham nos bastidores do Shark Tank. Eles buscam projetos pra apresentar pros Sharks — ou investir diretamente.', count: '30+' },
    { icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Investidores Internacionais', desc: 'Investidores globais que veem no Brasil o próximo grande mercado. Trazem capital forte e experiência que você não encontra em lugar nenhum.', count: '312+' },
  ];
  return (
    <section id="investidores" ref={ref} className="bg-dark-gradient py-16 sm:py-20 relative overflow-hidden">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-amber-500/10 text-amber-400 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4">Quem Vai Investir em Você</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            Centenas de Investidores <span className="text-teal-400">Prontos Para Investir</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-2">Eles estão na plataforma AGORA. Buscando ativamente o próximo projeto. <span className="text-amber-400 font-semibold">O próximo pode ser o seu.</span></p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {types.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-5 sm:p-6 card-hover group flex gap-4 sm:gap-5">
              <div className="flex-shrink-0">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">{t.icon}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                  <h3 className="text-white font-bold text-base sm:text-xl">{t.title}</h3>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded">{t.count}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { ref, isVisible } = useInView();
  const testimonials = [
    { name: 'Lucas Mendes', city: 'São Paulo, SP', text: 'Eu via o Shark Tank toda semana e pensava "eu queria essa chance". Quando entrei na plataforma, em 3 semanas recebi R$ 80.000 de um investidor-anjo. Meu app de delivery hoje atende 15 cidades. A chance que eu esperava finalmente apareceu.', amount: 'R$ 80.000', biz: 'App de Delivery' },
    { name: 'Camila Rodrigues', city: 'Rio de Janeiro, RJ', text: 'Eu jurava que era bom demais pra ser verdade. Mas entrei, apresentei meu projeto de café especial e recebi R$ 100.000. O investidor até me ajuda com mentorias hoje. Meu único arrependimento? Não ter entrado antes.', amount: 'R$ 100.000', biz: 'Café Especial' },
    { name: 'Rafael Souza', city: 'Belo Horizonte, MG', text: 'Minha ideia era simples: e-commerce de produtos sustentáveis. Não achava que investidor ia se interessar por algo tão simples. Recebi 3 lances em 2 semanas. Escolhi o melhor: R$45.000. Ideia simples também vale dinheiro.', amount: 'R$ 45.000', biz: 'E-commerce' },
    { name: 'Ana Paula Ferreira', city: 'Curitiba, PR', text: 'Sou médica e queria criar uma healthtech mas não tinha R$1 pra investir. Na plataforma, um fundo de investimento me ofereceu R$150.000. Mudou completamente a trajetória da minha vida profissional.', amount: 'R$ 150.000', biz: 'HealthTech' },
    { name: 'Pedro Henrique Lima', city: 'Salvador, BA', text: 'Eu queria abrir uma clínica veterinaria. Coloquei o projeto e em 10 dias já tinha proposta. R$60.000 que transformaram meu sonho de anos em realidade. Se você tem uma ideia, entra. Não pensa duas vezes.', amount: 'R$ 60.000', biz: 'Clínica Veterinária' },
    { name: 'Juliana Costa', city: 'Florianopolis, SC', text: 'Comecei com uma ideia de EdTech simples. 4 investidores deram lances. Fechei com R$200.000. Hoje temos 50.000 usuarios. A pessoa que investiu em mim enxergou algo que eu mesma duvidava. Essa plataforma muda vidas.', amount: 'R$ 200.000', biz: 'EdTech' },
  ];
  return (
    <section id="depoimentos" ref={ref} className="bg-section-dark py-16 sm:py-20 relative">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-teal-500/10 text-teal-400 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4">Resultados Reais</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            Gente Como Você Que Já <span className="text-gradient-gold">Recebeu Investimento</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-2">Sem experiência. Sem contato. Sem sorte. Só a ideia e a vontade. <span className="text-amber-400 font-semibold">Eles entraram e conseguiram. Você também pode.</span></p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-5 sm:p-6 card-hover">
              <div className="flex items-center gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400/30 mb-2" />
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm mb-3 sm:mb-4">{t.text}</p>
              <div className="border-t border-white/5 pt-3 sm:pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">{t.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-xs sm:text-sm truncate">{t.name}</div>
                    <div className="text-slate-500 text-[10px] sm:text-xs truncate">{t.city}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-teal-400 font-black text-xs sm:text-sm">{t.amount}</div>
                  <div className="text-slate-500 text-[10px] sm:text-xs">{t.biz}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNow() {
  const { ref, isVisible } = useInView();
  const reasons = [
    { icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Janela de Oportunidade', desc: 'O ecossistema de investimentos brasileiro está em expansão histórica. Os investidores estão entrando em massa agora. Quem chega primeiro tem vantagem. Quem demora, perde.' },
    { icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Mais Investidores Que Projetos', desc: 'Hoje existem 3x mais investidores buscando projetos do que empreendedores na plataforma. Isso significa que as chances de você receber lances são altas. Mas essa proporção vai mudar.' },
    { icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Processo Seguro e Transparente', desc: 'Contratos formais, due diligence, acompanhamento jurídico. Todo o processo é conduzido com seguranca total. Nada de informal — tudo documentado e profissional.' },
    { icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Mentoria Inclusa', desc: 'O investidor não só coloca dinheiro — ele coloca experiência. Você recebe orientação de quem já construiu negócios de sucesso. Dinheiro + mentoria é a combinacao que não falha.' },
    { icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Ideias Simples São Valiosas', desc: 'Esqueça que só startup de tecnologia recebe investimento. Restaurante, loja, clínica, salão — negócios tradicionais recebem tanto ou mais que startups. Simples escala mais rápido.' },
    { icon: <Lock className="w-5 h-5 sm:w-6 sm:h-6" />, title: 'Vagas Limitadas', desc: 'Para manter a proporção investidor/empreendedor e garantir que todo mundo receba lances, cada turma tem vagas limitadas. Quando fecha, só na proxima. E não sabemos quando.' },
  ];
  return (
    <section ref={ref} className="bg-dark-gradient py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-red-500/10 text-red-400 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4">Não Deixe Pra Depois</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            Por Que Você Precisa <span className="text-amber-400">Agir Agora</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-2">Cada dia que você espera é um dia que alguém com uma ideia parecida com a sua está lá dentro recebendo o investimento que poderia ser seu</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-4 sm:p-6 card-hover group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-teal-400/20 to-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">{r.icon}</div>
              <h3 className="text-white font-bold text-sm sm:text-lg mb-1.5 sm:mb-2">{r.title}</h3>
              <p className="text-slate-400 text-[11px] sm:text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 sm:mt-12 text-center">
          <div className="glass rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto border-l-4 border-red-400/60">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-white font-bold text-sm sm:text-base mb-1">O custo de não agir</p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Você vai continuar assistindo o Shark Tank pensando "eu podia ter feito isso"? Daqui a 1 ano, vai olhar pra trás e se perguntar: <span className="text-amber-400 font-semibold">"E se eu tivesse entrado naquele dia?"</span> O único risco real é o de ficar de fora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, isVisible } = useInView();
  const faqs = [
    { q: 'Eu realmente posso receber até R$100.000?', a: 'Sim. Investidores na plataforma já investiram de R$10.000 a R$500.000. O valor médio é R$ 75.000. R$ 100.000 é completamente realista — e acontece toda semana. Você pode conferir os depoimentos acima.' },
    { q: 'Eu preciso ter experiência empreendedora?', a: 'De jeito nenhum. Investidores-anjo investem na PESSOA tanto quanto na ideia. Vontade, paixão e disposição valem mais do que currículo. Muitos dos empreendedores que receberam investimento nunca tinham aberto um negócio antes.' },
    { q: 'Que tipo de negócio pode ser financiado?', a: 'Qualquer um. Restaurante, app, loja online, clínica, e-commerce, serviço, SaaS, produto artesanal, franquia. Investidores buscam diversidade e potencial de retorno — não só startup de tecnologia. Ideia simples com boa execução vale tanto quanto ideia complexa.' },
    { q: 'Como funciona o processo de investimento?', a: 'Você apresenta seu projeto. Investidores interessados fazem lances. Você escolhe o melhor. Todo o processo jurídico e de transferência é conduzido com segurança total e transparência completa. Você acompanha cada etapa.' },
    { q: 'E se eu não receber nenhum lance?', a: 'Com 3x mais investidores que empreendedores na plataforma, a chance de não receber lances é mínima. Mas se acontecer, você pode re-apresentar seu projeto. Nosso time te ajuda a otimizar tudo. E com a garantia de 7 dias, você não tem nada a perder.' },
    { q: 'Por que cobrar R$97 pra acessar?', a: 'Pense assim: R$97 é menos do que você gasta num jantar. É o investimento que filtra quem é sério, mantém a qualidade da plataforma e garante suporte completo. O retorno potencial? Até R$100.000 em financiamento. É 773x de retorno. Além disso, se não gostar, devolvemos os R$97 em 7 dias.' },
    { q: 'Isso é seguro? Como sei que não é golpe?', a: 'Contratos formais, due diligence, acompanhamento jurídico, investidores verificados com dados reais. Transparência total em cada etapa. E a garantia incondicional de 7 dias — se não confiar, pegue seu dinheiro de volta. Zero risco pra você.' },
    { q: 'Quanto tempo leva pra receber o investimento?', a: 'Os primeiros lances chegam em 1-3 semanas em média. O processo completo leva 3-8 semanas. Mas você já começa a ver interesse dos investidores nos primeiros dias.' },
  ];
  return (
    <section ref={ref} className="bg-section-dark py-16 sm:py-20">
      <div className={`max-w-3xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-teal-500/10 text-teal-400 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4">Transparência Total</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4">Perguntas Frequentes</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">Tire suas dúvidas. Se ainda não estiver 100% confiante, use a garantia de 7 dias sem risco.</p>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors">
                <span className="text-white font-semibold text-sm sm:text-base pr-3 sm:pr-4">{f.q}</span>
                <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-slate-300 leading-relaxed text-sm border-t border-white/5 pt-3 sm:pt-4">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  const { ref, isVisible } = useInView();
  return (
    <section ref={ref} className="bg-dark-gradient py-16 sm:py-20 relative overflow-hidden">
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass rounded-3xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden shine-effect">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-amber-400 to-teal-400" />
          <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-teal-400 mx-auto mb-4 sm:mb-6" />
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4">
            Garantia de <span className="text-teal-400">7 Dias</span> — Zero Risco Pra Você
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
            Se entrar na plataforma e por qualquer motivo achar que não é para você, basta pedir o reembolso em até 7 dias.
            <span className="text-white font-semibold"> Devolvemos cada centavo. Sem perguntas. Sem burocracia. Sem nenhuma dor de cabeça.</span>
          </p>
          <p className="text-slate-400 text-sm sm:text-base mb-5 sm:mb-6">
            Em outras palavras: <span className="text-amber-400 font-bold">ou você recebe lances de investimento, ou recebe seu dinheiro de volta.</span> Não tem como perder.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" /> Sem perguntas</div>
            <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" /> Reembolso total</div>
            <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" /> Em até 48h</div>
            <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" /> Zero risco</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const { ref, isVisible } = useInView();
  return (
    <section id="oferta" ref={ref} className="bg-section-accent py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(13,148,136,0.1)_0%,_transparent_70%)]" />
      <div className={`max-w-5xl mx-auto px-4 sm:px-6 relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block bg-amber-500/10 text-amber-400 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full mb-4">Oferta Especial — Vagas Limitadas</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight">
            Por R$97, Você Pode Receber <span className="text-gradient-gold">Até R$100.000</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <div className="glass rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden shine-effect">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
            <div className="mb-5 sm:mb-6">
              <div className="inline-block bg-red-500/15 text-red-400 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full mb-3 sm:mb-4 animate-pulse">OFERTA POR TEMPO LIMITADO</div>
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-1.5 sm:mb-2">Acesso Completo</h3>
              <p className="text-slate-400 text-xs sm:text-sm">Tudo que você precisa pra receber investimento</p>
            </div>
            <div className="mb-5 sm:mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="price-strike text-slate-500 text-lg sm:text-xl relative">R$ 497</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white">R$ 97</span>
                <span className="text-slate-400 text-xs sm:text-sm">/acesso único</span>
              </div>
              <p className="text-amber-400 text-xs sm:text-sm font-semibold mt-1.5">ou 12x de R$ 9,74 no cartão</p>
            </div>
            <div className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 flex-grow">
              {[
                'Acesso a 847+ investidores buscando seu projeto',
                'Perfil de empreendedor verificado',
                'Apresentação ilimitada de projetos',
                'Recebimento de lances sem limite',
                'Suporte dedicado do nosso time',
                'Mentoria em grupo semanal',
                'Modelos de pitch deck profissionais',
                'Comunidade exclusiva de empreendedores',
                'Garantia de 7 dias — ou seu dinheiro de volta',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>
            <a href="https://pay.cakto.com.br/qkqgyqo_915997" className="btn-cta-gold text-slate-900 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-2 pulse-glow-gold">
              GARANTIR MEU ACESSO POR R$97 <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <p className="text-slate-500 text-[10px] sm:text-xs text-center mt-2.5 sm:mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Pagamento 100% seguro • Acesso imediato
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="glass rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /></div>
                <h4 className="text-white font-bold text-base sm:text-lg">O Que Dizem os Números</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center bg-white/[0.03] rounded-lg p-3">
                  <div className="text-xl sm:text-2xl font-black text-teal-400">94%</div>
                  <div className="text-slate-400 text-[10px] sm:text-xs">recebem lances em 30 dias</div>
                </div>
                <div className="text-center bg-white/[0.03] rounded-lg p-3">
                  <div className="text-xl sm:text-2xl font-black text-amber-400">R$75k</div>
                  <div className="text-slate-400 text-[10px] sm:text-xs">investimento médio</div>
                </div>
                <div className="text-center bg-white/[0.03] rounded-lg p-3">
                  <div className="text-xl sm:text-2xl font-black text-white">3x</div>
                  <div className="text-slate-400 text-[10px] sm:text-xs">mais investidores que projetos</div>
                </div>
                <div className="text-center bg-white/[0.03] rounded-lg p-3">
                  <div className="text-xl sm:text-2xl font-black text-teal-400">2 sem</div>
                  <div className="text-slate-400 text-[10px] sm:text-xs">primeiro lance em média</div>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-5 sm:p-6 flex-grow">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-teal-500/20 flex items-center justify-center"><TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" /></div>
                <h4 className="text-white font-bold text-base sm:text-lg">O Retorno Sobre Seu Investimento</h4>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                Você investe <span className="text-amber-400 font-bold">R$97</span> pra acessar a plataforma.
                O retorno médio de investimento recebido é de <span className="text-teal-400 font-bold">R$ 75.000</span>.
              </p>
              <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-xl p-4 sm:p-5 text-center">
                <div className="text-slate-400 text-[10px] sm:text-xs mb-1">Retorno sobre investimento</div>
                <div className="text-3xl sm:text-4xl font-black text-teal-400">773x</div>
                <div className="text-slate-400 text-[10px] sm:text-xs mt-1">R$97 pode se transformar em R$75.000+</div>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">Compra 100% Protegida</h4>
                  <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed">Ambiente criptografado. Seus dados estão seguros. Garantia de 7 dias sem perguntas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="checkout" className="bg-dark-gradient py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[800px] h-96 sm:h-[800px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 sm:mb-6 leading-tight">
          Sua Ideia Merece <span className="text-gradient-gold">R$ 100.000</span>
          <br />
          <span className="text-gradient-hero">Você Só Precisa Do Acesso Certo</span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
          Centenas de investidores estão agora na plataforma, buscando o próximo projeto.
          <span className="text-amber-400 font-semibold"> O próximo pode ser o seu.</span>
        </p>
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <a href="https://pay.cakto.com.br/qkqgyqo_915997" className="btn-cta-gold text-slate-900 px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black text-lg sm:text-xl flex items-center gap-2 sm:gap-3 pulse-glow-gold">
            QUERO RECEBER MEU INVESTIMENTO
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-xs sm:text-sm">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>R$97 • Pagamento seguro • Acesso imediato • Garantia 7 dias</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xs sm:max-w-lg mx-auto mt-8 sm:mt-12">
          <div className="text-center"><Shield className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400 mx-auto mb-1.5 sm:mb-2" /><div className="text-slate-400 text-[10px] sm:text-xs">100% Seguro</div></div>
          <div className="text-center"><Zap className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-1.5 sm:mb-2" /><div className="text-slate-400 text-[10px] sm:text-xs">Acesso Imediato</div></div>
          <div className="text-center"><CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400 mx-auto mb-1.5 sm:mb-2" /><div className="text-slate-400 text-[10px] sm:text-xs">Garantia 7 Dias</div></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /></div>
            <span className="text-white font-bold text-sm sm:text-base">InvestConnect<span className="text-teal-400">BR</span></span>
          </div>
          <div className="text-slate-500 text-xs sm:text-sm text-center">InvestConnect BR Ltda. — Todos os direitos reservados.</div>
          <div className="flex items-center gap-4 sm:gap-6 text-slate-500 text-xs sm:text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="bg-slate-950 min-h-screen font-sans">
      <UrgencyBar />
      <Navbar />
      <Hero />
      <Ticker />
      <SocialProof />
      <Story />
      <HowItWorks />
      <InvestorTypes />
      <Testimonials />
      <WhyNow />
      <Faq />
      <Guarantee />
      <Offer />
      <FinalCTA />
      <Footer />
      <LiveNotification />
      <MobileStickyCTA />
    </div>
  );
}

export default App;

import React from 'react';
import { ArrowRight, Brain, Keyboard, MousePointerClick, Star } from 'lucide-react';

interface HowToPlayViewProps {
  onStartPlaying: () => void;
}

export const HowToPlayView: React.FC<HowToPlayViewProps> = ({ onStartPlaying }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          Como Jogar Hora do Rush
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Regras simples, movimentos em cadeia e raciocínio lógico na prática.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900 mb-2">
            1. Objetivo do Jogo
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Deslize os carros, vans e ônibus coloridos na grade 6×6 até abrir caminho livre para o{' '}
            <span className="font-semibold text-red-600">Carro Vermelho</span> chegar à{' '}
            <span className="font-semibold text-emerald-600">SAÍDA</span> à direita.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
            <Keyboard className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900 mb-2">
            2. Regras de Movimento
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cada veículo anda apenas na direção em que está estacionado (horizontal ou vertical) e não pode atravessar outros veículos. Você pode arrastar com o mouse/dedo ou clicar e usar as setas do teclado.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Star className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900 mb-2">
            3. Pontuação Global e Estrelas
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Quanto menos movimentos você fizer em relação ao número ideal da fase, mais pontos e estrelas (até 3) você ganha. O botão Dica calcula o próximo passo ótimo, mas reduz um pouco o bônus.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900 mb-2">
            4. Pensamento Computacional
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Para resolver as fases difíceis, pratique a{' '}
            <span className="font-semibold text-slate-800">decomposição</span>: descubra qual carro bloqueia a saída, depois quem bloqueia esse carro, planejando algoritmos em cadeia antes de mover!
          </p>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={onStartPlaying}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm"
        >
          <span>Ir para o Tabuleiro</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

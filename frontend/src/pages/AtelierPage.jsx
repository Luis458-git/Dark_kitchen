import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  ChevronRight,
  Layers,
  ThermometerSnowflake,
  Star
} from 'lucide-react';

const AtelierPage = () => {
  const [coleccionActiva, setColeccionActiva] = useState('nocturne');

  const colecciones = [
    { id: 'nocturne', label: 'Colección Noire', count: '04 Obras' },
    { id: 'smash', label: 'Laboratorio Smash & Truffle', count: '03 Creaciones' },
    { id: 'garde', label: 'Boulangerie de Medianoche', count: '05 Fermentaciones' }
  ];

  const productosAutor = {
    nocturne: [
      {
        nombre: 'Tartelette Noire Valrhona',
        subtitulo: 'Ganache de cacao Guanaja 70%, flor de sal marina de Guérande y polvo de oro',
        precio: '$18.50',
        fermentacion: '36 Horas',
        origen: 'Maison Noire Patisserie',
        tag: 'Firma de Autor'
      },
      {
        nombre: 'Cannelés Bordelais au Rhum Brun',
        subtitulo: 'Costra caramelizada en moldes de cobre batido, vainilla Bourbon de Madagascar',
        precio: '$14.00',
        fermentacion: '48 Horas Infusión',
        origen: 'Maison Noire',
        tag: 'Edición Nocturna'
      },
      {
        nombre: 'Brioche Feuilletée Cacao Pur',
        subtitulo: 'Hojaldrado artesanal con mantequilla de Bretaña AOP y gianduja de avellanas',
        precio: '$16.20',
        fermentacion: '72 Horas',
        origen: 'Le Fournil Noir',
        tag: 'Lenta Maduración'
      }
    ],
    smash: [
      {
        nombre: 'The Black Gold Wagyu Smash',
        subtitulo: 'Doble medallón A5 de 90g, cheddar inglés añejo 18 meses, emulsión de trufa negra',
        precio: '$26.00',
        fermentacion: 'Dry Aged 45D',
        origen: 'Smash Burger Co.',
        tag: 'Signature'
      },
      {
        nombre: 'Frites Allumettes al Parmigiano & Truffe',
        subtitulo: 'Papas pont-neuf en triple cocción en grasa de pato con ralladura de trufa fresca',
        precio: '$12.50',
        fermentacion: 'Triple Fritura',
        origen: 'Smash Burger Co.',
        tag: 'Clásico de Pase'
      }
    ],
    garde: [
      {
        nombre: 'Pain de Campagne al Carbón Vegetal',
        subtitulo: 'Masa madre centenaria con ceniza vegetal purificada y harina molida a piedra',
        precio: '$11.00',
        fermentacion: '72 Horas Frío',
        origen: 'Atelier Boulanger',
        tag: 'Masa Madre 1924'
      }
    ]
  };

  const criticas = [
    {
      cita: "Una operación que desafía la lógica del delivery convencional. La precisión térmica del empaque preserva texturas con rigor de tres estrellas.",
      medio: "Revue Gastronomique Internationale",
      critico: "Jean-Luc Moreau"
    },
    {
      cita: "La Tartelette Noire llega a la mesa exactamente a 16°C. El balance entre la amargura del cacao y la salmuera es magistral.",
      medio: "Le Guide Noir B2B",
      critico: "Éléonore Vance"
    }
  ];

  return (
    <div className="min-h-screen bg-noir-950 text-brand-primary selection:bg-gold-500/20 selection:text-gold-400">
      {/* Top Banner de Navegación Editorial */}
      <header className="border-b border-noir-700/60 bg-noir-900/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-lg tracking-wide font-bold">DarkKitchen Hub</span>
            <span className="text-[10px] font-mono text-gold-400 block tracking-widest uppercase">Gestor de Cocinas Ocultas & Despacho</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/pedidos"
            className="text-xs font-mono tracking-wider text-brand-secondary hover:text-gold-400 transition-colors px-3 py-1.5"
          >
            [CONSOLA DE DESPACHO]
          </Link>
          <Link
            to="/kds"
            className="text-xs font-mono tracking-wider text-brand-secondary hover:text-gold-400 transition-colors px-3 py-1.5"
          >
            [MONITOR KDS]
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded text-xs font-mono uppercase tracking-wider font-semibold bg-gold-400 text-noir-950 hover:bg-gold-300 transition-all shadow-gold-glow flex items-center space-x-1.5"
          >
            <span>Acceso Operativo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Editorial Gourmet */}
      <section className="relative px-8 py-24 max-w-6xl mx-auto border-b border-noir-700/40">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 text-xs font-mono mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="tracking-widest uppercase font-semibold">DarkKitchen Hub — Sistema B2B</span>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-primary leading-[1.1] mb-8 max-w-4xl">
          Elaborado en la penumbra de cada alba, con <span className="italic gold-gradient-text font-normal">fuego lento</span>, cacao puro y devoción.
        </h1>

        <p className="text-brand-secondary text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-10">
          DarkKitchen Hub centraliza el pase térmico, la trazabilidad de insumos y el despacho milimétrico de nuestras marcas satélite bajo estándares de alta gastronomía.
        </p>

        {/* Métricas de Manifiesto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-noir-700/60 font-mono">
          <div>
            <div className="text-3xl font-bold text-gold-400 tabular-nums">72h</div>
            <div className="text-xs text-brand-muted uppercase tracking-wider mt-1">Fermentación Máxima</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary tabular-nums">142</div>
            <div className="text-xs text-brand-muted uppercase tracking-wider mt-1">Recetas Estandarizadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-primary tabular-nums">18.4m</div>
            <div className="text-xs text-brand-muted uppercase tracking-wider mt-1">SLA Promedio Cocina</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 tabular-nums">99.4%</div>
            <div className="text-xs text-brand-muted uppercase tracking-wider mt-1">Conformidad Térmica</div>
          </div>
        </div>
      </section>

      {/* Selector de Colecciones Nocturnas & Cards de Autor */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary">Colecciones Nocturnas</h2>
            <p className="text-brand-secondary text-sm mt-1">Catálogo de producción de alta fidelidad para nuestras marcas de autor.</p>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-noir-900 p-1.5 rounded-lg border border-noir-700">
            {colecciones.map((col) => (
              <button
                key={col.id}
                onClick={() => setColeccionActiva(col.id)}
                className={`px-4 py-2 rounded text-xs font-mono transition-all duration-200 ${
                  coleccionActiva === col.id
                    ? 'bg-gold-400 text-noir-950 font-bold shadow-gold-glow'
                    : 'text-brand-secondary hover:text-brand-primary'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(productosAutor[coleccionActiva] || []).map((item, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-xl bg-noir-800 border border-noir-700 hover:border-gold-400/50 transition-all duration-300 flex flex-col justify-between hover:shadow-gold-glow/20"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-brand-muted mb-4">
                  <span className="text-gold-400 font-semibold">{item.origen}</span>
                  <span className="px-2 py-0.5 rounded bg-noir-900 border border-noir-700/80">{item.tag}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-primary group-hover:text-gold-400 transition-colors">
                  {item.nombre}
                </h3>
                <p className="text-brand-secondary text-xs mt-3 leading-relaxed font-light">
                  {item.subtitulo}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-noir-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-brand-muted block uppercase">Fermentación / Pase</span>
                  <span className="text-xs font-mono text-brand-secondary font-medium">{item.fermentacion}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-serif font-bold text-gold-400 tabular-nums">{item.precio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Críticas Gastronómicas y Manifiesto de Despacho */}
      <section className="px-8 py-20 border-t border-noir-700/40 bg-noir-900/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold block mb-2">Recepción Crítica</span>
            <h2 className="font-serif text-3xl font-bold">El veredicto de la prensa culinaria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {criticas.map((crit, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-noir-850 border border-noir-700/70 relative">
                <div className="flex text-gold-400 space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <blockquote className="font-serif text-lg italic text-brand-primary leading-relaxed mb-6">
                  "{crit.cita}"
                </blockquote>
                <div className="border-t border-noir-700/60 pt-4 flex items-center justify-between font-mono text-xs">
                  <span className="text-brand-primary font-semibold">{crit.critico}</span>
                  <span className="text-gold-400">{crit.medio}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Editorial */}
      <footer className="border-t border-noir-700/60 px-8 py-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs font-mono text-brand-muted">
        <div>
          <span>DarkKitchen Hub © 2026</span>
          <span className="mx-2">·</span>
          <span>Gestor Empresarial de Cocinas Ocultas B2B</span>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-6">
          <Link to="/login" className="hover:text-gold-400 transition-colors">Consola Operativa</Link>
          <Link to="/kds" className="hover:text-gold-400 transition-colors">Monitor KDS</Link>
          <Link to="/marcas" className="hover:text-gold-400 transition-colors">Marcas Satélite</Link>
        </div>
      </footer>
    </div>
  );
};

export default AtelierPage;

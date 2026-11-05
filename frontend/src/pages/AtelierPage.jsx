import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/images';
import PlatilloDetalleModal from '../components/common/PlatilloDetalleModal';
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
  Star,
  Moon,
  Wine
} from 'lucide-react';

const AtelierPage = () => {
  const [coleccionActiva, setColeccionActiva] = useState('nocturne');
  const [platilloSeleccionado, setPlatilloSeleccionado] = useState(null);

  const colecciones = [
    { id: 'nocturne', label: 'Creaciones de la Noche', count: '04 Obras' },
    { id: 'smash', label: 'Laboratorio Smash & Truffle', count: '03 Creaciones' },
    { id: 'garde', label: 'Boulangerie de Medianoche', count: '05 Fermentaciones' }
  ];

  const creacionesDeLaNoche = [
    {
      nombre: 'Tartelette Noire aux Figues',
      subtitulo: 'Ganache de cacao Guanaja 70%, higos negros macerados, flor de sal de Guérande y hoja de oro.',
      precio: '$18.50',
      fermentacion: '36 Horas',
      origen: 'Maison Noire',
      tag: 'Firma de Autor',
      imagen: IMAGES.tarteletteNoire
    },
    {
      nombre: 'Cannelés Bordelais au Rhum',
      subtitulo: 'Costra caramelizada en moldes de cobre batido, corazón cremoso con vainilla Bourbon de Madagascar.',
      precio: '$14.00',
      fermentacion: '48 Horas Infusión',
      origen: 'Maison Noire',
      tag: 'Edición Nocturna',
      imagen: IMAGES.cannelesBordelais
    },
    {
      nombre: 'Brioche Feuilletée au Sucre',
      subtitulo: 'Hojaldrado artesanal con mantequilla de Bretaña AOP, azúcar perlado y gianduja tibia.',
      precio: '$16.20',
      fermentacion: '72 Horas',
      origen: 'Le Fournil Noir',
      tag: 'Lenta Maduración',
      imagen: IMAGES.briocheFeuilly
    },
    {
      nombre: 'Coffret Signature "L\'Atelier"',
      subtitulo: 'Selección curada de 8 piezas numeradas de pastelería nocturna con maridaje de café etíope.',
      precio: '$38.00',
      fermentacion: 'Edición Numerada',
      origen: 'DarkKitchen Hub',
      tag: 'Cofre Exclusivo',
      imagen: IMAGES.coffretSignature
    }
  ];

  const otrasColecciones = {
    smash: [
      {
        nombre: 'The Black Gold Wagyu Smash',
        subtitulo: 'Doble medallón A5 de 90g, cheddar inglés añejo 18 meses, emulsión de trufa negra.',
        precio: '$26.00',
        fermentacion: 'Dry Aged 45D',
        origen: 'Smash Burger Co.',
        tag: 'Signature',
        imagen: IMAGES.coffretSignature
      },
      {
        nombre: 'Frites Allumettes al Parmigiano & Truffe',
        subtitulo: 'Papas pont-neuf en triple cocción en grasa de pato con ralladura de trufa fresca.',
        precio: '$12.50',
        fermentacion: 'Triple Fritura',
        origen: 'Smash Burger Co.',
        tag: 'Clásico de Pase',
        imagen: IMAGES.tarteletteNoire
      }
    ],
    garde: [
      {
        nombre: 'Pain de Campagne al Carbón Vegetal',
        subtitulo: 'Masa madre centenaria con ceniza vegetal purificada y harina molida a piedra.',
        precio: '$11.00',
        fermentacion: '72 Horas Frío',
        origen: 'Atelier Boulanger',
        tag: 'Masa Madre 1924',
        imagen: IMAGES.heroAtelierDore
      }
    ]
  };

  const listaProductos = coleccionActiva === 'nocturne' ? creacionesDeLaNoche : (otrasColecciones[coleccionActiva] || []);

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
          <div className="w-9 h-9 rounded bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shadow-gold-glow">
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

      {/* Hero Editorial Gourmet con Fotografía Principal */}
      <section className="relative px-8 pt-20 pb-16 max-w-6xl mx-auto border-b border-noir-700/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 text-xs font-mono mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tracking-widest uppercase font-semibold">DarkKitchen Hub — Sistema B2B</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-brand-primary leading-[1.1] mb-6">
              Elaborado en la penumbra de cada alba, con <span className="italic gold-gradient-text font-normal">fuego lento</span>, cacao puro y devoción.
            </h1>

            <p className="text-brand-secondary text-base md:text-lg font-light leading-relaxed mb-8 max-w-xl">
              DarkKitchen Hub centraliza el pase térmico, la trazabilidad de insumos y el despacho milimétrico de nuestras marcas satélite bajo estándares de alta gastronomía.
            </p>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-3 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-gold-glow flex items-center space-x-2"
              >
                <span>Ingresar al Pase Operativo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pedidos"
                className="px-6 py-3 rounded-lg bg-noir-900 hover:bg-noir-800 text-brand-primary text-xs font-mono font-semibold tracking-wider uppercase border border-noir-700 transition-all"
              >
                Ver Comandas en Vivo
              </Link>
            </div>
          </div>

          {/* Fotografía Hero con Bordes Redondeados & Badge Flotante */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-[#282A33] shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/20 to-transparent z-10"></div>
              
              <img
                src={IMAGES.heroAtelierNoir}
                alt="Dark luxury editorial food photography"
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />

              {/* Badge Flotante "Servicio 20:00 — 03:00" */}
              <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-noir-950/90 border border-gold-400/40 text-gold-400 text-xs font-mono backdrop-blur-md shadow-gold-glow">
                <Moon className="w-3.5 h-3.5" />
                <span className="font-semibold tracking-wider">Servicio 20:00 — 03:00</span>
              </div>

              {/* Pie de Foto Flotante */}
              <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-lg bg-noir-900/90 border border-noir-700/80 backdrop-blur-md text-xs font-mono">
                <div className="text-gold-400 font-semibold font-serif text-sm">Tartelette Noire au Chocolat</div>
                <div className="text-brand-secondary text-[11px] mt-0.5">Maison Noire · Pase Térmico 16°C</div>
              </div>
            </div>
          </div>
        </div>

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

      {/* Sección: Creaciones de la Noche con Imágenes en Cards */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold mb-2">Carta de Autor</div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary">Creaciones de la Noche</h2>
            <p className="text-brand-secondary text-sm mt-1">Catálogo de producción de alta fidelidad para nuestras marcas satélite.</p>
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

        {/* Grid de 4 Productos con Imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listaProductos.map((item, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => setPlatilloSeleccionado(item)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setPlatilloSeleccionado(item)}
              className="group cursor-pointer p-4 rounded-xl bg-noir-900 border border-noir-700/80 hover:border-gold-400/50 transition-all duration-300 flex flex-col justify-between hover:shadow-gold-glow/20 focus:outline-none focus:border-gold-400"
            >
              <div>
                {/* Contenedor de Imagen con Zoom Hover */}
                <div className="overflow-hidden rounded-lg mb-4 bg-noir-950 border border-noir-800 relative">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="object-cover h-52 w-full group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-noir-950/80 border border-noir-700/80 text-[10px] font-mono text-gold-400 backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>

                <div className="text-xs font-mono text-gold-400 font-semibold mb-1">
                  {item.origen}
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-primary group-hover:text-gold-400 transition-colors line-clamp-1">
                  {item.nombre}
                </h3>
                <p className="text-brand-secondary text-xs mt-2 leading-relaxed font-light line-clamp-2">
                  {item.subtitulo}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-noir-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-brand-muted block uppercase">Pase</span>
                  <span className="text-xs font-mono text-brand-secondary font-medium">{item.fermentacion}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-serif font-bold text-gold-400 tabular-nums">{item.precio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Bespoke Catering con Imagen de Fondo (salonCatering) */}
      <section className="relative px-8 py-24 border-t border-noir-700/40 overflow-hidden">
        {/* Imagen de Fondo con Degradado hacia #0D0E12 */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.salonCatering}
            alt="Salón Privado & Eventos Nocturnos"
            className="w-full h-full object-cover filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/85 to-noir-950/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 text-xs font-mono mb-6">
            <Wine className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase font-semibold">Bespoke Catering & Salón Privado</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-primary mb-6">
            Experiencias gastronómicas de autor fuera del pase habitual.
          </h2>

          <p className="text-brand-secondary text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Organizamos veladas privadas, caterings exclusivos y lanzamientos culinarios con despacho térmico en locación y brigada de servicio especializada.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gold-400 hover:bg-gold-300 text-noir-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-gold-glow"
          >
            <span>Reservar Servicios de Catering</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Críticas Gastronómicas */}
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

      {/* Modal de Detalle y Compra de Platillo */}
      {platilloSeleccionado && (
        <PlatilloDetalleModal
          item={platilloSeleccionado}
          onClose={() => setPlatilloSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default AtelierPage;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UtensilsCrossed, LogOut, Store, ChefHat, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { usuario, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <UtensilsCrossed size={24} />
        <span>DarkKitchen Hub</span>
      </div>

      <div className="nav-links">
        <NavLink
          to="/marcas"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Store size={18} />
            <span>Marcas</span>
          </div>
        </NavLink>

        <NavLink
          to="/platillos"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ChefHat size={18} />
            <span>Platillos</span>
          </div>
        </NavLink>

        <NavLink
          to="/pedidos"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ClipboardList size={18} />
            <span>Despacho / Pedidos</span>
          </div>
        </NavLink>
      </div>

      <div className="nav-user">
        <span className="user-badge">{usuario?.nombre || usuario?.correo || 'Usuario'}</span>
        <button onClick={logout} className="btn-logout" title="Cerrar sesión">
          <LogOut size={16} />
          <span>Salir</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

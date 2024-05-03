import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>Información de contacto</h3>
          <p>Dirección: 123 Calle Principal, Ciudad, País</p>
          <p>Teléfono: +123 456 789</p>
          <p>Email: info@tuempresa.com</p>
        </div>
        <div className={styles.column}>
          <h3>Enlaces útiles</h3>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Productos</a></li>
            <li><a href="#">Nosotros</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Síguenos en redes sociales</h3>
          <ul className={styles.socialLinks}>
            <li><a href="#"><i className="fab fa-facebook"></i> Facebook</a></li>
            <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
            <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.copyRight}>
        <p>&copy; 2024 Tu Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
export default Footer;

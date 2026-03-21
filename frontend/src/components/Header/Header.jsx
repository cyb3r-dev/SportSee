import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo/Logo';
import styles from './Header.module.css';

export default function Header() {
    const { logout } = useAuth();
    return (
        <header>
            <Logo />
            <nav>
                <div className={styles.links}>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/profile">Mon profil</Link>
                </div>
                <a href="/" className={styles.logout} onClick={logout}>Se déconecter</a>
            </nav>
        </header>
    );
}
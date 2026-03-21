import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo/Logo';
import styles from './Login.module.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Logo />
                <form onSubmit={handleSubmit}>
                    <h3>Transformez<br/>vos stats en résultats</h3>
                    <div className={styles.fields}>
                        <h4>Se connecter</h4>
                        <div className={styles.field}>
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit">Se connecter</button>
                    <Link to="/">Mot de passe oublié ?</Link>
                </form>
            </div>
            <div className={styles.background}>
                <img src="images/background.jpg" alt="Background"/>
                <p>Analysez vos performances en un clin d’œil,<br/>suivez vos progrès et atteignez vos objectifs.</p>
            </div>
        </div>
    );
}
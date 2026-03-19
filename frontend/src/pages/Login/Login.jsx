import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import styles from './Login.module.css';

export default function Login() {
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
                    <h1>Transformez<br/>vos stats en résultats</h1>
                    <div className={styles.fields}>
                        <h2>Se connecter</h2>
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
                <img src="images/background.jpg" alt="background" />
                <p>Analysez vos performances en un clin d’œil,<br/>suivez vos progrès et atteignez vos objectifs.</p>
            </div>
        </div>
    );
}
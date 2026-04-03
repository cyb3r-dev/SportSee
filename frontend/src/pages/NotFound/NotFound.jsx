import { Link } from "react-router-dom";
import styles from './NotFound.module.css';

export default function NotFound() {
    return (
        <>
        <div className={styles.container}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.subtitle}>Page non trouvée</p>
                <Link className={styles.link} to="/">Retourner à la page précédente</Link>
            </div>
        </>
    );
}
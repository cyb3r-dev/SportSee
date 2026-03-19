import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Profile from '../../components/Profile/Profile';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <Header />
            <div className={styles.banner}>
                <Profile />
                <div className={styles.distance}>
                    <span>Distance totale parcourue</span>
                    <div className={styles.achievement}>
                        <img src="images/achievement.png" alt="Achievement" />
                        <h4>{user.statistics.totalDistance} km</h4>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
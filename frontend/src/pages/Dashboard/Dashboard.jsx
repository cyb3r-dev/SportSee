import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Profile from '../../components/Profile/Profile';
import styles from './Dashboard.module.css';
import WeekStat from '../../components/WeekStat/WeekStat';
import DistanceChart from '../../components/DistanceChart/DistanceChart';
import HeartRateChart from '../../components/HeartRateChart/HeartRateChart';

export default function DashboardPage() {
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
            <main className={styles.dashboard}>
                <section>
                    <div className={styles.title}>
                        <h4>Vos dernières performances</h4>
                    </div>
                    <div className={styles.container}>
                        <DistanceChart />
                        <HeartRateChart />
                    </div>
                </section>
                <section>
                    <div className={styles.title}>
                        <h4>Cette semaine</h4>
                        <span>Du 23/06/2025 au 30/06/2025</span>
                    </div>
                    <div className={styles.container}>
                        <div className={`${styles.card} ${styles.dailyGoals}`}>
                            <div className={styles.title}>
                                
                            </div>
                        </div>
                        <div className={styles.stats}>
                            <WeekStat desc="Durée d'activité" value="140" valueColor="#0B23F4" unit="minutes" unitColor="#B6BDFC" />
                            <WeekStat desc="Distance" value="21.7" valueColor="#F4320B" unit="kilomètres" unitColor="#FCC1B6" />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
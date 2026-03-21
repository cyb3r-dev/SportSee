import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Profile from '../../components/Profile/Profile';
import styles from './Profile.module.css';
import ProfileStat from '../../components/ProfileStat/ProfileStat';

export default function ProfilePage() {
    const { user } = useAuth();
    return (
        <>
            <Header />
            <main className={styles.profile}>
                <section className={styles.profile}>
                    <div>
                        <Profile />
                    </div>
                    <div className={styles.informations}>
                        <div className={styles.title}>
                            <h4>Votre profil</h4>
                        </div>
                        <div className={styles.infos}>
                            <span>Âge : {user.profile.age}</span>
                            <span>Genre : {user.profile.gender === 'male' ? 'Homme' : 'Femme'}</span>
                            <span>Taille : {Math.floor(user.profile.height / 100)}m{(user.profile.height % 100).toString().padStart(2, '0')}</span>
                            <span>Poids : {user.profile.weight}kg</span>
                        </div>
                    </div>
                </section>
                <section className={styles.statistics}>
                    <div className={styles.title}>
                        <h4>Vos statistiques</h4>
                        <span>depuis le {new Date(user.profile.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className={styles.stats}>
                        <ProfileStat desc="Durée totale courue" value={`${Math.floor(user.statistics.totalDuration / 60)}h`} unit={`${user.statistics.totalDuration % 60}min`} />
                        <ProfileStat desc="Calories brûlées" value={user.statistics.totalBurntCalories} unit="cal" />
                        <ProfileStat desc="Distance totale parcourue" value={user.statistics.totalDistance} unit="km" />
                        <ProfileStat desc="Nombre de jours de repos" value={user.statistics.totalDaysOff} unit="jours" />
                        <ProfileStat desc="Nombre de sessions" value={user.statistics.totalSessions} unit="sessions" />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
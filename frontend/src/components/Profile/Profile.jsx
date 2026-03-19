import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
    const { user } = useAuth();
    return (
        <div className={styles.profile}>
            <div className={styles.avatar}>
                <img src={user.profile.profilePicture} alt="Avatar"/>
            </div>
            <div className={styles.info}>
                <h4>{user.profile.firstName} {user.profile.lastName}</h4>
                <span>Member depuis le {new Date(user.profile.createdAt).toLocaleDateString("fr-FR", {year: "numeric", month: "long", day: "numeric"})}</span>
            </div>
        </div>
    );
}
import styles from './ProfileStat.module.css';

export default function ProfileStat({ desc, value, unit }) {
    return (
        <div className={styles.profileStat}>
            <span>{desc}</span>
            <div className={styles.stat}>
                <h4 className={styles.value}>{value}</h4>
                <span className={styles.unit}>{unit}</span>
            </div>
        </div>
    );
}
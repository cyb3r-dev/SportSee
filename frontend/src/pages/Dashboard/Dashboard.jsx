import { useAuth } from '../../context/AuthContext';
import timeService from '../../services/timeService';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Profile from '../../components/Profile/Profile';
import styles from './Dashboard.module.css';
import WeekStat from '../../components/WeekStat/WeekStat';
import DistanceChart from '../../components/charts/DistanceChart/DistanceChart';
import HeartRateChart from '../../components/charts/HeartRateChart/HeartRateChart';
import { useEffect, useState } from 'react';
import dataService from '../../services/dataService';
import { Cell, Legend, Pie, PieChart } from 'recharts';

export default function DashboardPage() {
    const { user } = useAuth();

    const startDate = timeService.getMonday();
    const getPeriod = () => {
        const sunday = new Date(startDate);
        sunday.setDate(startDate.getDate() + 6);
        const formatWithDoubleDigit = (date) => {
            return date.toLocaleDateString('fr-FR');
        };
        return `${formatWithDoubleDigit(startDate)} - ${formatWithDoubleDigit(sunday)}`;
    };

    const [weeklyStats, setWeeklyStats] = useState({
        totalSessions: 0,
        totalDuration: 0,
        totalDistance: 0
    });

    useEffect(() => {
        const fetchWeeklyStats = async () => {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            const result = await dataService.getUserActivities(startDate, endDate);
            if (result && Array.isArray(result)) {
                let totalSessions = 0, totalDuration = 0, totalDistance = 0;

                for (const activity of result) {
                    totalSessions += 1;
                    totalDuration += activity.duration || 0;
                    totalDistance += activity.distance || 0;
                }

                setWeeklyStats({
                    totalSessions,
                    totalDuration,
                    totalDistance: totalDistance.toFixed(1)
                });
            }
        };
        fetchWeeklyStats();
    }, []);

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
                        <span>Du {getPeriod()}</span>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.weeklyGoal}>
                            <div className={styles.header}>
                                <div className={styles.title}>
                                    <h3>x{weeklyStats.totalSessions}</h3>
                                    <span>sur objectif de {user.profile.weeklyGoal}</span>
                                </div>
                                <span>Courses hebdomadaire réalisées</span>
                            </div>
                            <PieChart
                                style={{ width: '100%', aspectRatio: 2 / 1 }}>
                                <Pie
                                    data={[
                                        { name: `${weeklyStats.totalSessions} Réalisées`, value: weeklyStats.totalSessions },
                                        { name: `${Math.max(0, user.profile.weeklyGoal - weeklyStats.totalSessions)} Restantes`, value: Math.max(0, user.profile.weeklyGoal - weeklyStats.totalSessions) }
                                    ]}
                                    innerRadius={40}
                                    outerRadius={80}
                                    stroke="none">
                                    {['#0B23F4', '#B6BDFC'].map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    formatter={(value) => <span style={{ color: '#707070', fontSize: '0.75rem' }}>{value}</span>}
                                />
                            </PieChart>
                        </div>
                        <div className={styles.stats}>
                            <WeekStat desc="Durée d'activité" value={weeklyStats.totalDuration} valueColor="#0B23F4" unit="minutes" unitColor="#B6BDFC" />
                            <WeekStat desc="Distance" value={weeklyStats.totalDistance} valueColor="#F4320B" unit="kilomètres" unitColor="#FCC1B6" />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
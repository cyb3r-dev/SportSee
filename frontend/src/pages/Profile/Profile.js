import { useAuth } from '../../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    return (
        <main>
            <div>
                <ul>
                    <li>{user.profile.firstName} {user.profile.lastName}</li>
                    <li>Member depuis le {new Date(user.profile.createdAt).toLocaleDateString("fr-FR", {year: "numeric", month: "long", day: "numeric"})}</li>
                </ul>
                <ul>
                    <li>Age : {user.profile.age}</li>
                    <li>Genre : {user.profile.gender}</li>
                    <li>Taille : {user.profile.height}</li>
                    <li>Poids : {user.profile.weight}</li>
                </ul>
                <ul>
                    <li>depuis le {new Date(user.profile.createdAt).toLocaleDateString("fr-FR", {year: "numeric", month: "long", day: "numeric"})}</li>
                    <li>Durée totale courue : {Math.floor(user.statistics.totalDuration / 60)}h {user.statistics.totalDuration % 60}min</li>
                    <li>Distance totale parcourue : {user.statistics.totalDistance}km</li>
                    <li>Nombre de sessions : {user.statistics.totalSessions}</li>
                </ul>
            </div>
        </main>
    );
}
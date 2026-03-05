import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();
    return (
        <main>
            <div>
                <ul>
                    <li>{user.profile.firstName} {user.profile.lastName}</li>
                    <li>Member depuis le {new Date(user.profile.createdAt).toLocaleDateString("fr-FR", {year: "numeric", month: "long", day: "numeric"})}</li>
                </ul>
                <ul>
                    <li>Durée totale parcourue {user.statistics.totalDistance}km</li>
                </ul>
                <button onClick={logout}>Logout</button>
            </div>
        </main>
    );
}
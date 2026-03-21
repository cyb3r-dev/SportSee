const USE_MOCK = process.env.REACT_APP_USE_MOCK || false;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('token');

function getNbDaysOff(runningData, createdAt) {
    const now = new Date();
    const nbTotalDays = Math.round((now - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    const pastSessions = runningData.filter((session) => new Date(session.date) <= now);
    const nbDaysSessions = new Set(pastSessions.map((session) => session.date)).size;
    return nbTotalDays - nbDaysSessions;
}

const dataService = {
    setAuthToken(token) {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },
    async login(username, password) {
        const response = await fetch(
            USE_MOCK ? 'data.json' : `${API_BASE_URL}/login`,
            USE_MOCK ? {} : {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            }
        );
        if (USE_MOCK) {
            const user = await response.json();
            return {
                token: btoa(JSON.stringify({ userId: user.id })),
                userId: user.id
            };
        } else {
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            const data = await response.json();
            if (data.token) this.setAuthToken(data.token);
            return data;
        }
    },
    async getUserInfo() {
        const response = await fetch(
            USE_MOCK ? 'data.json' : `${API_BASE_URL}/user-info`,
            USE_MOCK ? {} : {headers: {'Authorization': `Bearer ${getToken()}`}}
        );
        if (USE_MOCK) {
            const user = await response.json();
            const runningData = user.runningData.filter((session) => new Date(session.date) <= new Date());
            return {
                profile: user.userInfos,
                statistics: {
                    totalDistance: runningData.reduce((sum, session) => sum + session.distance, 0).toFixed(1),
                    totalSessions: runningData.length,
                    totalDuration: runningData.reduce((sum, session) => sum + session.duration, 0),
                    totalBurntCalories: runningData.reduce((sum, session) => sum + session.caloriesBurned, 0),
                    totalDaysOff: getNbDaysOff(runningData, user.userInfos.createdAt)
                }
            };
        } else {
            if (!response.ok) throw new Error('Failed to get user info');
            return response.json();
        }
    },
    async getUserActivities(startWeek, endWeek) {
        const response = await fetch(
            USE_MOCK ? 'data.json' : `${API_BASE_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
            USE_MOCK ? {} : {headers: {'Authorization': `Bearer ${getToken()}`}}
        );
        if (USE_MOCK) {
            const user = await response.json();
            const filteredSessions = user.runningData.filter((session) => {
                const sessionDate = new Date(session.date);
                return sessionDate >= new Date(startWeek) && sessionDate <= new Date(endWeek);
            });
            return filteredSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            if (!response.ok) throw new Error('Failed to get user activities');
            return response.json();
        }
    }
};

export default dataService;
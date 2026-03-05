const USE_MOCK = process.env.REACT_APP_USE_MOCK || false;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('token');

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
            return {
                'profile': {
                    'firstName': user.userInfos.firstName,
                    'lastName': user.userInfos.lastName,
                    'createdAt': user.userInfos.createdAt,
                    'age': user.userInfos.age,
                    'height': user.userInfos.height,
                    'weight': user.userInfos.weight,
                    'profilePicture': user.userInfos.profilePicture
                },
                'statistics': {
                    'totalDistance': user.runningData.reduce((sum, session) => sum + session.distance, 0).toFixed(1),
                    'totalSessions': user.runningData.length,
                    'totalDuration': user.runningData.reduce((sum, session) => sum + session.duration, 0)
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
                return sessionDate >= new Date(startWeek) && sessionDate <= new Date(endWeek) && sessionDate <= new Date();
            });
            return filteredSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            if (!response.ok) throw new Error('Failed to get user activities');
            return response.json();
        }
    }
};

export default dataService;
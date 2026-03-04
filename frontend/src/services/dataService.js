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
        if (USE_MOCK) {
            const response = await fetch('data.json');
            const users = await response.json();
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                const mockToken = btoa(JSON.stringify({ userId: user.id }));
                this.setAuthToken(mockToken);
                return { token: mockToken, userId: user.id };
            }
            throw new Error('Invalid credentials');
        } else {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
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
        if (USE_MOCK) {
            const token = getToken();
            if (!token) throw new Error('No token found');
            const decoded = JSON.parse(atob(token));
            const userId = decoded.userId;
            const response = await fetch('data.json');
            const users = await response.json();
            const user = users.find(u => u.id === userId);
            if (!user) throw new Error('User not found');
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
            const response = await fetch(`${API_BASE_URL}/user-info`, {headers: {'Authorization': `Bearer ${getToken()}`}});
            if (!response.ok) throw new Error('Failed to get user info');
            return response.json();
        }
    },
    
    async getUserActivities(startWeek, endWeek) {
        if (USE_MOCK) {
            const token = getToken();
            if (!token) throw new Error('No token found');
            const decoded = JSON.parse(atob(token));
            const userId = decoded.userId;
            const response = await fetch('data.json');
            const users = await response.json();
            const user = users.find(u => u.id === userId);
            if (!user) throw new Error('User not found');
            const filteredSessions = user.runningData.filter((session) => {
                const sessionDate = new Date(session.date);
                return sessionDate >= new Date(startWeek) && sessionDate <= new Date(endWeek) && sessionDate <= new Date();
            });
            return filteredSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            const response = await fetch(`${API_BASE_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`, { headers: {'Authorization': `Bearer ${getToken()}`} });
            if (!response.ok) throw new Error('Failed to get activities');
            return response.json();
        }
    }
};

export default dataService;
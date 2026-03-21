const express = require("express");
const jwt = require("jsonwebtoken");

const users = require("./data.json");

const SECRET_KEY = "secret-key";

const getUserById = (userId) => {
    return users.find((user) => user.id === userId);
};

const router = express.Router();

const { authenticateToken, generateToken } = require("./middleware");

router.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required" });
    }
    const user = users.find((u) => u.username === username);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user.id);
    return res.json({
        token,
        userId: user.id,
    });
});

router.get("/api/user-info", authenticateToken, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user = getUserById(decodedToken.userId);
    const runningData = user.runningData.filter((session) => new Date(session.date) <= new Date());
    return res.json({
        profile: user.userInfos,
        statistics: {
            totalDistance: runningData.reduce((sum, session) => sum + session.distance, 0).toFixed(1),
            totalSessions: runningData.length,
            totalDuration: runningData.reduce((sum, session) => sum + session.duration, 0),
            totalBurntCalories: runningData.reduce((sum, session) => sum + session.caloriesBurned, 0),
            totalDaysOff: getNbDaysOff(runningData, user.userInfos.createdAt)
        }
    });
});

function getNbDaysOff(runningData, createdAt) {
    const now = new Date();
    const nbTotalDays = Math.round((now - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    const pastSessions = runningData.filter((session) => new Date(session.date) <= now);
    const nbDaysSessions = new Set(pastSessions.map((session) => session.date)).size;
    return nbTotalDays - nbDaysSessions;
}

router.get("/api/user-activity", authenticateToken, (req, res) => {
    const { startWeek, endWeek } = req.query;
    if (!startWeek || !endWeek) {
        return res.status(400).json({ message: "startWeek and endWeek are required" });
    }
    const user = getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const filteredSessions = user.runningData.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= new Date(startWeek) && sessionDate <= new Date(endWeek) && sessionDate <= new Date();
    });
    const sortedSessions = filteredSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    return res.json(sortedSessions);
});

module.exports = router;
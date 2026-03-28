const timeService = {
    getToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    },
    getMonday(weekOffset = 0) {
        const today = this.getToday(), monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) - Math.max(0, Math.floor(weekOffset) * 7));
        return monday;
    }
}

export default timeService;
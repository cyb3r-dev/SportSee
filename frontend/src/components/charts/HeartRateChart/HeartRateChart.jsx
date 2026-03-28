import { useState, useEffect } from 'react';
import dataService from '../../../services/dataService';
import timeService from '../../../services/timeService';
import ChartLayout from '../../ChartLayout/ChartLayout';
import { ComposedChart, CartesianGrid, YAxis, XAxis, Bar, Line, Legend } from 'recharts';

export default function HeartRateChart() {
    const [startDate, setStartDate] = useState(() => timeService.getMonday());

    const handlePrev = () => {
        setStartDate(prev => {
            const newMonday = new Date(prev);
            newMonday.setDate(prev.getDate() - 7);
            return newMonday;
        });
    };

    const handleNext = () => {
        setStartDate(prev => {
            const newMonday = new Date(prev);
            newMonday.setDate(prev.getDate() + 7);
            return newMonday;
        });
    };

    const getPeriod = () => {
        const sunday = new Date(startDate);
        sunday.setDate(startDate.getDate() + 6);
        const formatWithDoubleDigit = (date) => {
            return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleDateString('fr', { month: 'short' }).replace('.', '')}`;
        };
        return `${formatWithDoubleDigit(startDate)} - ${formatWithDoubleDigit(sunday)}`;
    };

    const isCurrentWeek = () => {
        return startDate.toDateString() === timeService.getMonday().toDateString();
    };

    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            const result = await dataService.getUserActivities(startDate, endDate);
            if (result && Array.isArray(result)) {
                const daily = [];
                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setHours(0, 0, 0, 0);
                    currentDate.setDate(startDate.getDate() + i);
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

                    const activity = result.find(a => a.date === dateStr);
                    let minHR = 0;
                    let maxHR = 0;
                    let avgHR = 0;

                    if (activity && activity.heartRate) {
                        minHR = activity.heartRate.min;
                        maxHR = activity.heartRate.max;
                        avgHR = activity.heartRate.average;
                    }

                    daily.push({
                        day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
                        minHR,
                        maxHR,
                        avgHR
                    });
                }
                setDailyData(daily);
            }
        };
        fetchData();
    }, [startDate]);

    const weeklyAvgBPM = dailyData.length > 0 ? Math.round(dailyData.filter(day => day.avgHR > 0).reduce((sum, day) => sum + day.avgHR, 0) / dailyData.filter(day => day.avgHR > 0).length) : 0;

    return (
        <ChartLayout
            title={weeklyAvgBPM + ' BPM'}
            subtitle="Fréquence cardiaque moyenne"
            color="#F4320B"
            onPrev={handlePrev}
            onNext={handleNext}
            period={getPeriod()}
            disableNext={isCurrentWeek()}>
            <ComposedChart
                style={{ width: '100%', aspectRatio: 1.6 }}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <YAxis
                    width="auto"
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: '.625rem' }}
                    tickFormatter={(value) => value}
                    tickCount={4}
                    domain={[120, 200]}
                    allowDataOverflow
                />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: '.75rem' }}
                />
                <Bar
                    dataKey="minHR"
                    fill="#FCC1B6"
                    radius={[7, 7, 7, 7]}
                    maxBarSize={14}
                    name="Min"
                />
                <Bar
                    dataKey="maxHR"
                    fill="#F4320B"
                    radius={[7, 7, 7, 7]}
                    maxBarSize={14}
                    name="BPM Max"
                />
                <Line
                    type="monotone"
                    dataKey="avgHR"
                    stroke="#F2F3FF"
                    strokeWidth={2}
                    dot={{ fill: '#0B23F4', r: 5 }}
                    activeDot={{ fill: '#0B23F4', r: 5 }}
                    name="BPM Moyen"
                />
                <Legend
                    align="start"
                    formatter={(value) => <span style={{ color: '#707070' }}>{value}</span>}
                />
            </ComposedChart>
        </ChartLayout>
    );
}
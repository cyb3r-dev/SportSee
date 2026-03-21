import { useState, useEffect } from 'react';
import dataService from '../../services/dataService';
import ChartLayout from "../ChartLayout/ChartLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function DistanceChart() {
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 28);
        return monday;
    });

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
        sunday.setDate(startDate.getDate() + 27);
        const formatWithDoubleDigit = (date) => {
            return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleDateString('fr', { month: 'short' }).replace('.', '')}`;
        };
        return `${formatWithDoubleDigit(startDate)} - ${formatWithDoubleDigit(sunday)}`;
    };

    const isPastFourWeeks = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentWeekMonday = new Date(today);
        currentWeekMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        const fourWeeksAgoMonday = new Date(currentWeekMonday);
        fourWeeksAgoMonday.setDate(currentWeekMonday.getDate() - 28);
        return startDate.toDateString() === fourWeeksAgoMonday.toDateString();
    };

    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 27);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            try {
                const result = await dataService.getUserActivities(startDate, endDate);
                if (result && Array.isArray(result)) {
                    const weekly = [];
                    for (let i = 0; i < 4; i++) {
                        const weekStart = new Date(startDate);
                        weekStart.setDate(startDate.getDate() + (i * 7));
                        weekStart.setHours(0, 0, 0, 0);

                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekStart.getDate() + 6);
                        weekEnd.setHours(23, 59, 59, 999);

                        const weekActivities = result.filter(activity => {
                            const activityDate = new Date(activity.date);
                            activityDate.setHours(12, 0, 0, 0);
                            return activityDate >= weekStart && activityDate <= weekEnd;
                        });
                        
                        const totalDistance = weekActivities.reduce((sum, activity) => {
                            return sum + (activity.distance || 0);
                        }, 0);

                        weekly.push({
                            week: `S${i + 1}`,
                            distance: totalDistance
                        });
                    }

                    setWeeklyData(weekly);
                } else {
                    setWeeklyData([]);
                }
            } catch (error) {
                setWeeklyData([]);
            }
        };
        fetchData();
    }, [startDate]);

    return (
        <ChartLayout
            title="18km en moyenne"
            subtitle="Total des kilomètres 4 dernières semaines"
            color="#0B23F4"
            onPrev={handlePrev}
            onNext={handleNext}
            period={getPeriod()}
            disableNext={isPastFourWeeks()}>
            <BarChart
                style={{ width: '100%', aspectRatio: 1 }}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <YAxis
                    width="auto"
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: '.625rem' }}
                    tickFormatter={(value) => value}
                    tickCount={4}
                />
                <XAxis
                    dataKey="week"
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: '.75rem' }}
                />
                <Bar
                    dataKey="distance"
                    fill="#B6BDFC"
                    radius={[7, 7, 7, 7]}
                    maxBarSize={14}
                    name="Distance"
                />
                <Legend
                    align="start"
                    formatter={(value) => <span style={{ color: '#707070' }}>{value}</span>}
                />
                <Tooltip />
            </BarChart>
        </ChartLayout>
    );
}
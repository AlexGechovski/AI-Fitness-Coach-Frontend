import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Button, CircularProgress } from '@mui/material';
import jwt from 'jwt-decode';

interface Exercise {
  name: string;
  sets: string | null;
  reps: string | null;
  duration: string | null;
}

interface WorkoutDay {
  day: string;
  workout: string;
  exercises: Exercise[];
  dayId: number;
}

const WeeklyWorkoutPage: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<WorkoutDay[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function getDecodedAccessToken(token: string): any {
    try {
      return jwt(token);
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('JWT token not found in local storage');
          return;
        }

        const tokenUsername = getDecodedAccessToken(token).sub;
        setUsername(tokenUsername);
        console.log('tokenUsername', tokenUsername);
        const url = `http://localhost:8080/api/v1/${tokenUsername}/weekly-workout`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setWorkoutData(data);
        } else {
          console.error('Error fetching workout data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
      }
    };

    fetchWorkoutData();
  }, []);

  const handleGenerateWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }


      const tokenUsername = getDecodedAccessToken(token).sub;
      setUsername(tokenUsername);
      console.log('tokenUsername', tokenUsername);

      setIsLoading(true);

      const response = await fetch(`http://localhost:8080/api/v1/${tokenUsername}/weekly-workout/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkoutData(data);
      } else {
        console.error('Error generating workout:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Weekly Workout Schedule
      </Typography>
      {workoutData.length > 0 ? (
        <Grid container spacing={2}>
          {workoutData.map((day) => (
            <Grid item xs={12} sm={6} md={4} key={day.dayId}>
              <Paper elevation={3} style={{ padding: '1rem' }}>
                <Typography variant="h6">{day.day}</Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  {day.workout || 'Rest Day'}
                </Typography>
                {day.exercises.length > 0 ? (
                  <ul style={{ paddingLeft: '1rem' }}>
                    {day.exercises.map((exercise, index) => (
                      <li key={index}>
                        <Typography variant="subtitle1">{exercise.name}</Typography>
                        {exercise.sets && <Typography variant="body2">Sets: {exercise.sets}</Typography>}
                        {exercise.reps && <Typography variant="body2">Reps: {exercise.reps}</Typography>}
                        {exercise.duration && (
                          <Typography variant="body2">Duration: {exercise.duration}</Typography>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No exercises for this day.
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {isLoading ? (
            <div>
            <Typography variant="h6">Generating the best workout based on your stats!</Typography>
            <CircularProgress />
            </div>
          ) : (
            <>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                You don't have a workout scheduled.
              </Typography>
              <Button variant="contained" onClick={handleGenerateWorkout}>
                Generate Workout
              </Button>
            </>
          )}
        </div>
      )}
      
    </div>
  );
};

export default WeeklyWorkoutPage;

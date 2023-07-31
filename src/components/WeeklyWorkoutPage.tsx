import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, CircularProgress} from '@mui/material';
import jwt from 'jwt-decode';
import "../index.css";
import CreateExerciseModal from './CreateExerciseModal';
import EditExerciseModal, { Exercise as EditExercise } from './EditExerciseModal';



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
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState<boolean>(false);
  const [isEditExerciseModalOpen, setIsEditExerciseModalOpen] = useState<boolean>(false);

  const [currentExercise, setCurrentExercise] = useState<EditExercise>({
    name: "",
    sets: null,
    reps: null,
    duration: null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDayId, setCurrentDayId] = useState<number | null>(null);
  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(null);
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: "",
    sets: null,
    reps: null,
    duration: null,
  });


  function getDecodedAccessToken(token: string): any {
    try {
      return jwt(token);
    } catch (error) {
      return null;
    }
  }

  const handleUpdateExercise = async (exercise: Exercise ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }
      const tokenUsername = getDecodedAccessToken(token).sub;

      if (currentDayId === null || currentExerciseId === null) {
        console.error('No day or exercise selected for updating an exercise');
        return;
      }

      // PUT request to update the exercise in the current day
      const response = await fetch(
        `http://localhost:8080/api/v1/${tokenUsername}/weekly-workout/${currentDayId}/exercises/${currentExerciseId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(exercise),
        }
      );

      if (response.ok) {
        // Exercise updated successfully, you may want to update the UI accordingly or refetch the data
        // For example, you can refetch the data with fetchWorkoutData() to get the updated data after updating the exercise.
        const updatedWorkoutData = [...workoutData];
        updatedWorkoutData[currentDayId].exercises[currentExerciseId] = exercise;
        setWorkoutData(updatedWorkoutData);
        // Close the modal after updating the exercise
        handleCloseEditExerciseModal();
      } else {
        console.error('Error updating exercise:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleOpenEditExerciseModal = (exercise: EditExercise) => {
    setCurrentExercise(exercise);
    setIsEditExerciseModalOpen(true);
  };

  const handleCloseEditExerciseModal = () => {
    setIsEditExerciseModalOpen(false);
  };

  const handleOpenAddExerciseModal = () => {
    setIsAddExerciseModalOpen(true);
  };

  const handleCloseAddExerciseModal = () => {
    setIsAddExerciseModalOpen(false);
  };

  const handleDeleteExercise = async (exerciseId: number , dayId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }
      const tokenUsername = getDecodedAccessToken(token).sub;
      if (dayId === null) {
        console.error('No day selected for deleting an exercise');
        return;
      }

      // DELETE request to remove the exercise from the current day
      const response = await fetch(
        `http://localhost:8080/api/v1/${tokenUsername}/weekly-workout/${dayId}/exercises/${exerciseId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const updatedWorkoutData = [...workoutData];
        updatedWorkoutData[dayId].exercises.splice(exerciseId, 1);
        setWorkoutData(updatedWorkoutData);
      } else {
        console.error('Error deleting exercise:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };


  const handleDeleteWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }
      const tokenUsername = getDecodedAccessToken(token).sub;

      const response = await fetch(`http://localhost:8080/api/v1/${tokenUsername}/weekly-workout`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWorkoutData([]);
      } else {
        console.error('Error deleting workout:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };


  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('JWT token not found in local storage');
          return;
        }

        const tokenUsername = getDecodedAccessToken(token).sub;

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

  const handleSaveExercise = async (exercise: Exercise) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }
      const tokenUsername = getDecodedAccessToken(token).sub;

      if (currentDayId === null) {
        console.error('No day selected for adding an exercise');
        return;
      }

      // POST request to add the new exercise to the current day
      const response = await fetch(
        `http://localhost:8080/api/v1/${tokenUsername}/weekly-workout/${currentDayId}/exercises`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(exercise),
        }
      );

      if (response.ok) {
        // Exercise added successfully, you may want to update the UI accordingly or refetch the data
        // For example, you can refetch the data with fetchWorkoutData() to get the updated data after adding the exercise.
        const updatedWorkoutData = [...workoutData];
        updatedWorkoutData[currentDayId].exercises.push(exercise);
        setWorkoutData(updatedWorkoutData);
        // Close the modal after saving the exercise
        handleCloseAddExerciseModal();
      } else {
        console.error('Error adding exercise:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  return (
    <div>
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Weekly Workout Schedule
      </Typography>
      {workoutData.length > 0 ? (
       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '1rem' }}>
          {workoutData.map((day,index) => (
            <Paper elevation={3} style={{ padding: '1rem', minWidth: 170 , borderRadius: '15px' }} key={day.dayId}>
              <Typography variant="h6">{day.day}</Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {day.workout || 'Rest Day'}
              </Typography>
              <Button variant="text" size='small' style={{ marginLeft: '1rem' }} onClick={() => {
              setCurrentDayId(index);
              handleOpenAddExerciseModal();
            }}>Add Exercise
            </Button>
              {day.exercises.length > 0 ? (
                <div style={{ paddingLeft: '1rem'}}>
                  {day.exercises.map((exercise, index) => (
                    <div key={index} style={{ border: '0.1px solid #ccc', marginBottom:'2rem', backgroundColor: '#FCFCFC', padding: '0.5rem', borderRadius: '8px'}}>
                      <Typography variant="subtitle1"><strong>{exercise.name}</strong></Typography>
                      {exercise.sets && <Typography variant="body2">Sets: {exercise.sets}</Typography>}
                      {exercise.reps && <Typography variant="body2">Reps: {exercise.reps}</Typography>}
                      {exercise.duration && (
                        <Typography variant="body2">Duration: {exercise.duration}</Typography>
                      )}
                      <Button variant="text" size='small'
                      onClick={() => {
                        setCurrentDayId(day.dayId - 1);
                        setCurrentExerciseId(index);
                        handleOpenEditExerciseModal(exercise);
                      }}
                        >Edit</Button>
                      <Button variant="text" size='small' color='error' onClick={() => {
                      handleDeleteExercise(index , day.dayId - 1);
                      }}>Delete</Button>

                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No exercises for this day.
                </Typography>
              )}
            </Paper>
          ))}
        </div>

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
      {workoutData.length > 0 && (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Button variant="contained" color="error" onClick={handleDeleteWorkout}>
          Delete Workout
        </Button>
      </div>
    )}

  <CreateExerciseModal onClose={handleCloseAddExerciseModal} onSaveExercise={handleSaveExercise} open={isAddExerciseModalOpen} />
    {isEditExerciseModalOpen && (
          <EditExerciseModal
            initialExercise={currentExercise}
            onClose={handleCloseEditExerciseModal}
            onUpdateExercise={handleUpdateExercise}
            open={isEditExerciseModalOpen}
          />
        )}
      </div>
  );
};
export default WeeklyWorkoutPage;

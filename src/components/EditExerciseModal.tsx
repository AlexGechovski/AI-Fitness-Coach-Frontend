import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

export interface Exercise {
  name: string;
  sets: string | null;
  reps: string | null;
  duration: string | null;
}

export interface EditExerciseModalProps {
  initialExercise: Exercise;
  onClose: () => void;
  onUpdateExercise: (exercise: Exercise) => Promise<void>;
  open: boolean; // This prop is added
}

const EditExerciseModal: React.FC<EditExerciseModalProps> = ({ initialExercise, onClose, onUpdateExercise, open }) => {
  const [exercise, setExercise] = useState<Exercise>(initialExercise);

  // This useEffect hook updates the exercise state whenever the initialExercise prop changes.
  useEffect(() => {
    setExercise(initialExercise);
  }, [initialExercise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExercise((prevExercise) => ({
      ...prevExercise,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    onUpdateExercise(exercise);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Exercise</DialogTitle>
      <DialogContent>
        <TextField
          label="Exercise Name"
          name="name"
          value={exercise.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Sets"
          name="sets"
          value={exercise.sets || ''}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Reps"
          name="reps"
          value={exercise.reps || ''}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Duration"
          name="duration"
          value={exercise.duration || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleUpdate} color="primary">
          Save
        </Button>
        <Button variant="contained" onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExerciseModal;

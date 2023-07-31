import React, { useState } from 'react';
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

  export interface CreateExerciseModalProps {
    onClose: () => void;
    onSaveExercise: (exercise: Exercise) => Promise<void>;
    open: boolean; // This prop is added
  }

  const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({ onClose, onSaveExercise, open }) => {
   const [exercise, setExercise] = useState<Exercise>({
    name: '',
    sets: null,
    reps: null,
    duration: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExercise((prevExercise) => ({
      ...prevExercise,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSaveExercise(exercise);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Exercise</DialogTitle>
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
        <Button variant="contained" onClick={handleSave} color="primary">
          Save
        </Button>
        <Button variant="contained" onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateExerciseModal;

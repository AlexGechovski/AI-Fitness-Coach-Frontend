import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface CreateGoalModalProps {
  onClose: () => void;
  onSaveGoal: (goal: any) => void;
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ onClose, onSaveGoal }) => {
  const [goal, setGoal] = useState<any>({
    goalId: 0,
    goalDescription: '',
    targetWeight: 0,
    targetBodyFatPercentage: 0,
    targetCaloricIntake: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal((prevGoal: any) => ({
      ...prevGoal,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSaveGoal(goal);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Create Goal</DialogTitle>
      <DialogContent>
        <TextField
          label="Goal Description"
          name="goalDescription"
          value={goal.goalDescription}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Target Weight"
          name="targetWeight"
          value={goal.targetWeight}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Target Body Fat Percentage"
          name="targetBodyFatPercentage"
          value={goal.targetBodyFatPercentage}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Target Caloric Intake"
          name="targetCaloricIntake"
          value={goal.targetCaloricIntake}
          onChange={handleChange}
          type="number"
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

export default CreateGoalModal;

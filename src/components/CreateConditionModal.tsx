import React, { useState } from 'react';
import { Button,  TextField,  Dialog,DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface CreateConditionModalProps {
  onClose: () => void;
  onSaveCondition: (condition: any) => void;
}

const CreateConditionModal: React.FC<CreateConditionModalProps> = ({ onClose, onSaveCondition }) => {
  const [condition, setCondition] = useState<any>({
    conditionDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCondition((prevCondition: any) => ({
      ...prevCondition,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSaveCondition(condition);
  };

  return (
<Dialog open onClose={onClose}>
      <DialogTitle>Create Health Condition</DialogTitle>
      <DialogContent>
        <TextField
          label="Condition Description"
          name="conditionDescription"
          value={condition.conditionDescription}
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

export default CreateConditionModal;

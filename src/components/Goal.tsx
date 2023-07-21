import React from 'react';
import { Typography, ListItem, ListItemText, Button, Stack } from '@mui/material';

interface GoalProps {
  goal: {
    goalId: number;
    goalDescription: string;
    targetWeight: number;
    targetBodyFatPercentage: number;
    targetCaloricIntake: number;
  };
  handleDelete: () => void;
}

const Goal: React.FC<GoalProps> = ({ goal , handleDelete }) => {
  const handleUpdate = () => {
    // Handle update logic here
  };

  

  return (
    <div className='container'>
      <ListItem >
        <ListItemText
          primary={
            <Typography variant="h6" component="span">
              {goal.goalDescription}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography variant="body1">Target Weight: {goal.targetWeight}</Typography>
              <Typography variant="body1">
                Target Body Fat Percentage: {goal.targetBodyFatPercentage}
              </Typography>
              <Typography variant="body1">
                Target Caloric Intake: {goal.targetCaloricIntake}
              </Typography>
            </React.Fragment>
          }
        />

      </ListItem>
      <ListItem
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid #000',
            padding: '8px',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </ListItem>
    </div>
  );
};

export default Goal;

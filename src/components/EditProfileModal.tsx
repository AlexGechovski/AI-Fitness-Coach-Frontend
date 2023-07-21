import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  onSaveProfile: (updatedProfile: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profileData, onSaveProfile }) => {
  const [updatedProfile, setUpdatedProfile] = useState<any>({
    age: profileData.age,
    gender: profileData.gender,
    height: profileData.height,
    weight: profileData.weight,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProfile((prevProfile: any) => ({
      ...prevProfile,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSaveProfile(updatedProfile);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField
          label="Age"
          name="age"
          value={updatedProfile.age}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Gender"
          name="gender"
          value={updatedProfile.gender}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Height"
          name="height"
          value={updatedProfile.height}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Weight"
          name="weight"
          value={updatedProfile.weight}
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

export default EditProfileModal;

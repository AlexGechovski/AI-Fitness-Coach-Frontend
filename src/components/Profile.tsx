import { useEffect, useState } from 'react';

import Goal from './Goal';
import { Typography, ListItem, ListItemText, Button, Stack, Modal } from '@mui/material';
import jwt from 'jwt-decode';
import CreateGoalModal from './CreateGoalModal';
import { enqueueSnackbar } from 'notistack';
import CreateConditionModal from './CreateConditionModal';
import EditProfileModal from './EditProfileModal';
import '../index.css';
import profileImg from '../assets/profile.png';

const Profile = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCreateConditionModalOpen, setCreateConditionModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);



  function getDecodedAccessToken(token: string): any {
    try {
      return jwt(token);
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('JWT token not found in local storage');
          return;
        }

        const tokenUsername = getDecodedAccessToken(token).sub;
        console.log(tokenUsername); // Display the decoded token object in the console
        setUsername(tokenUsername);
        const url = `http://localhost:8080/api/v1/profile/${tokenUsername}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveProfile = async (updatedProfile: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }
      window.location.reload();
      const response = await fetch(`http://localhost:8080/api/v1/profile/${username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(updatedProfile),
      });
      
      if (response.ok) {
        enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        const updatedProfileData = await response.json();
        setProfileData(updatedProfileData);
        handleCloseEditModal();

      } else {
        console.error('Error updating profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  
  

  const handleDeleteGoal = async (goalId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }
      const tokenUsername = getDecodedAccessToken(token).sub;
      const response = await fetch(`http://localhost:8080/api/v1/profile/${tokenUsername}/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        enqueueSnackbar('Goal deleted successfully', { variant: 'success' });
        // Goal deleted successfully
        setProfileData((prevProfileData: any) => {
          // Filter out the deleted goal from the profileData
          const updatedGoals = prevProfileData.goals.filter((goal: any) => goal.goalId !== goalId);
          return {
            ...prevProfileData,
            goals: updatedGoals,
          };
        });
      } else {
        // Handle delete error
        console.error('Error deleting goal:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleCreateGoal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
  };

  const handleSaveGoal = async (goal: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }

      const tokenUsername = getDecodedAccessToken(token).sub;
      const response = await fetch(`http://localhost:8080/api/v1/profile/${tokenUsername}/goals`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goal),
      });

      if (response.ok) {
        enqueueSnackbar('Goal created successfully', { variant: 'success' });
        const newGoal = await response.json();

        setProfileData((prevProfileData: any) => {
          const updatedGoals = [...prevProfileData.goals, newGoal];
          return {
            ...prevProfileData,
            goals: updatedGoals,
          };
        });

        setCreateModalOpen(false);
      } else {
        console.error('Error creating goal:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDeleteCondition = async (conditionId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }
      const tokenUsername = getDecodedAccessToken(token).sub;
      const response = await fetch(`http://localhost:8080/api/v1/profile/${tokenUsername}/health-conditions/${conditionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Condition deleted successfully
        setProfileData((prevProfileData: any) => {
          // Filter out the deleted condition from the profileData
          const updatedConditions = prevProfileData.healthConditions.filter((condition: any) => condition.conditionId !== conditionId);
          return {
            ...prevProfileData,
            healthConditions: updatedConditions,
          };
        });
      } else {
        // Handle delete error
        console.error('Error deleting condition:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting condition:', error);
    }
  };


  const handleCreateCondition = () => {
    setCreateConditionModalOpen(true);
  };

  const handleCloseConditionModal = () => {
    setCreateConditionModalOpen(false);
  };

  const handleSaveCondition = async (condition: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('JWT token not found in local storage');
        return;
      }

      const tokenUsername = getDecodedAccessToken(token).sub;
      const response = await fetch(`http://localhost:8080/api/v1/profile/${tokenUsername}/health-conditions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(condition),
      });

      if (response.ok) {
        enqueueSnackbar('Condition created successfully', { variant: 'success' });
        const newCondition = await response.json();

        setProfileData((prevProfileData: any) => {
          const updatedConditions = [...prevProfileData.healthConditions, newCondition];
          return {
            ...prevProfileData,
            healthConditions: updatedConditions,
          };
        });

        setCreateConditionModalOpen(false);
      } else {
        console.error('Error creating condition:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating condition:', error);
    }
  };




  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginLeft: '3%', marginRight: '3%' }}>
      <h1>Profile View</h1>
      <div className="profile-container">
      <div className="profile-info">
        <div className=''>
  
  <img
            src={profileImg}
            alt="Profile Picture"
            style={{ width: '15rem', height: '15rem',
            borderRadius: '50%',
            marginTop: '1.5rem' }}
          />
          
  <ul>
  <h1>Name: {username}</h1>
    <li>Age: {profileData.age}</li>
    <li>Gender: {profileData.gender}</li>
    <li>Height: {profileData.height}</li>
    <li>Weight: {profileData.weight}</li>
  </ul>
  </div>
  <Button variant="contained" color='secondary' onClick={handleOpenEditModal}>
    Edit Profile
  </Button>
</div>


        <div className="goals-column">
          <h2>Goals:</h2>
          <ul>
            {profileData.goals.map((goal: any) => (
              <Goal key={goal.goalId} goal={goal} handleDelete={() => handleDeleteGoal(goal.goalId)} />
            ))}
          </ul>
          <Button variant="contained" color='secondary' onClick={handleCreateGoal}>
            Create Goal
          </Button>
        </div>
        <div className="health-conditions-column">
          <h2>Health Conditions:</h2>
          <ul>
            {profileData?.healthConditions?.map((condition: any) => (
              <div className='container'>
              <ListItem key={condition.conditionId} >
                <ListItemText primary={<Typography variant='h6'> Condition: {condition.conditionDescription} </Typography>} />
                
              </ListItem>

              <ListItem className='line-top'>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button  variant="contained" color="primary" onClick={() => handleDeleteCondition(condition.conditionId)}>
                  Update
            </Button> 
            <Button variant="contained" color="error" onClick={() => handleDeleteCondition(condition.conditionId)}>
                  Delete
            </Button> 
          </Stack>
        </ListItem>
              </div>
            ))}
          </ul>
          <Button variant="contained" color='secondary' onClick={handleCreateCondition}>
            Create Condition
          </Button>
        </div>
      </div>

      <Modal open={isCreateModalOpen} onClose={handleCloseModal}>
        <CreateGoalModal onClose={handleCloseModal} onSaveGoal={handleSaveGoal} />
      </Modal>
      <Modal open={isCreateConditionModalOpen} onClose={handleCloseConditionModal}>
        <CreateConditionModal onClose={handleCloseConditionModal} onSaveCondition={handleSaveCondition} />
      </Modal>
      <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        profileData={profileData}
        onSaveProfile={handleSaveProfile}
      />
    </Modal>
    </div>
  );
};

export default Profile;

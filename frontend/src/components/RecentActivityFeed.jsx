import React from 'react';
import { FiActivity, FiClock, FiAward, FiTarget } from 'react-icons/fi';
import { GiMuscleUp } from 'react-icons/gi';
import api from '../api';

const RecentActivityFeed = ({ recentWorkouts = [], loading = false }) => {
  console.log('Recent workouts:', recentWorkouts);

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderWorkoutDetails = (workout) => {
    if (!workout || typeof workout !== 'object') return null;
    
    // Add fallbacks for all properties
    const safeWorkout = {
      type: workout.type || 'unknown',
      duration: workout.duration || 0,
      distance: workout.distance || 0,
      points: workout.points || 0,
      muscleGroup: workout.muscleGroup || '',
      exercises: workout.exercises || []
    };

    if (safeWorkout.type === 'cardio') {
      return (
        <div className="activity-stats">
          <span><FiClock /> {safeWorkout.duration} mins</span>
          <span><FiTarget /> {safeWorkout.distance} km</span>
          <span className="intensity">{workout.intensity || 'N/A'}</span>
          <span><FiAward /> {safeWorkout.points} pts</span>
        </div>
      );
    } else {
      // For strength workouts
      return (
        <div className="activity-stats">
          <span className="muscle-group">{safeWorkout.muscleGroup ? formatMuscleGroup(safeWorkout.muscleGroup) : 'General'}</span>
          <span>{(safeWorkout.exercises?.length || 0)} exercises</span>
          <span>{getTotalSets(safeWorkout)} sets</span>
          <span><FiAward /> {safeWorkout.points} pts</span>
        </div>
      );
    }
  };

  const formatMuscleGroup = (muscleGroup) => {
    return muscleGroup
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTotalSets = (workout) => {
    if (!workout?.exercises) return 0;
    return workout.exercises.reduce((total, exercise) => 
      total + (exercise.sets?.length || 0), 0
    );
  };

  const getWorkoutTitle = (workout) => {
    if (workout.type === 'cardio') {
      return workout.name;
    } else {
      return `${formatMuscleGroup(workout.muscleGroup)} Workout`;
    }
  };

  const getWorkoutIcon = (type) => {
    return type === 'cardio' ? 
      <FiActivity className="icon cardio" /> : 
      <GiMuscleUp className="icon strength" />;
  };

  if (recentWorkouts.length === 0) {
    return (
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {loading ? (
          <p className="no-activity">Loading activities...</p>
        ) : (
          <p className="no-activity">No recent workouts logged</p>
        )}
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <h2>Recent Activity</h2>
      <div className="activity-list">
        {recentWorkouts?.map((workout) => (
          <div key={workout._id} className={`activity-item ${workout.type}`}>
            {getWorkoutIcon(workout.type)}
            <div className="activity-details">
              <div className="activity-header">
                <h3>{getWorkoutTitle(workout)}</h3>
                <span className="workout-date">{formatDate(workout.date)}</span>
              </div>
              {renderWorkoutDetails(workout)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityFeed; 
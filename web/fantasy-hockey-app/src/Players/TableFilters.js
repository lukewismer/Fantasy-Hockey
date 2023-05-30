import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useUser } from '../UserContext';

const positionFilterStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      backgroundColor: '#ffffff',
      borderRadius: theme.shape.borderRadius,
      border: '1px solid #000000',
      '&:hover': {
        backgroundColor: '#ffffff',
      },
      '& .MuiSelect-icon': {
        color: '#000000',
      },
      '& .MuiSelect-select': {
        color: '#000000',
        paddingRight: theme.spacing(4),
      },
      '& .MuiInputLabel-root': {
        color: '#000000',
        fontSize: '1.2em',
        textAlign: 'center',
      },
    },
    menuItem: {
      '&:hover': {
        backgroundColor: '#f2f2f2',
      },
    },
  }));
  

export const PositionFilter = ({ selectedPosition, handlePositionChange }) => {
  const classes = positionFilterStyles();

  const positionLabels = {
    'G': 'Goalies',
    'D': 'Defence',
    'L': 'Left Wing',
    'C': 'Center',
    'R': 'Right Wing',
    'LRC': 'Forwards',
    'LRCD': 'Skaters',
    'LRCDG': 'All',
  };

  const positionValues = {
    'G': ['G'],
    'D': ['D'],
    'L': ['L'],
    'C': ['C'],
    'R': ['R'],
    'LRC': ['L', 'R', 'C'],
    'LRCD': ['L', 'R', 'C', 'D'],
    'LRCDG': ['L', 'R', 'C', 'D', 'G'],
  };

  // Find the key of positionValues that matches selectedPosition
  const selectedLabelKey = Object.keys(positionValues).find(key =>
    JSON.stringify(positionValues[key]) === JSON.stringify(selectedPosition)
  );

  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="position-select-label"
        id="position-select"
        value={selectedLabelKey}
        onChange={e => handlePositionChange(positionValues[e.target.value])}
      >
        {Object.entries(positionLabels).map(([value, label]) => (
          <MenuItem className={classes.menuItem} key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};


const statsFilterStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #000000',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
    '& .MuiSelect-icon': {
      color: '#000000',
    },
    '& .MuiSelect-select': {
      color: '#000000',
      paddingRight: theme.spacing(4),
    },
    '& .MuiInputLabel-root': {
      color: '#000000',
      fontSize: '1.2em',
      textAlign: 'center',
    },
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
  },
}));

export const StatsFilter = ({ isFantasyStats, handleStatsChange }) => {
  const classes = statsFilterStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="stats-select-label"
        id="stats-select"
        value={isFantasyStats}
        onChange={handleStatsChange}
      >
        <MenuItem className={classes.menuItem} value={true}>Fantasy Stats</MenuItem>
        <MenuItem className={classes.menuItem} value={false}>Regular Stats</MenuItem>
      </Select>
    </FormControl>
  );
};

const teamFilterStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #000000',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
    '& .MuiSelect-icon': {
      color: '#000000',
    },
    '& .MuiSelect-select': {
      color: '#000000',
      paddingRight: theme.spacing(4),
    },
    '& .MuiInputLabel-root': {
      color: '#000000',
      fontSize: '1.2em',
      textAlign: 'center',
    },
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
  },
}));


export const TeamFilter = ({ selectedTeam, handleTeamChange, teams }) => {
  const classes = teamFilterStyles();

  const [activeTeams, setActiveTeams] = useState([]);

  useEffect(() => {
    if (teams && teams.length !== 0){
      let temp_activeTeams = [];
      for (let team of teams){
        if (team.data.years["20222023"].Roster !== null){
          temp_activeTeams.push(team)
      }
      setActiveTeams(temp_activeTeams)
      }
    }
  }, [teams])
  

  return (
    <FormControl className={classes.formControl}>
    {activeTeams ? (
      <Select
        labelId="team-select-label"
        id="team-select"
        value={selectedTeam || "All Teams"}
        onChange={handleTeamChange}
      >
        <MenuItem className={classes.menuItem} value={"All Teams"}>All Teams</MenuItem>
        {activeTeams.map((team) => (
          <MenuItem className={classes.menuItem} key={team.data.team_details.id} value={team.data.team_details.abbreviation}>
            {team.data.team_details.abbreviation}
          </MenuItem>
        ))}
      </Select>
    ): <></>}
      
    </FormControl>
  );
};

const managerFilterStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #000000',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
    '& .MuiSelect-icon': {
      color: '#000000',
    },
    '& .MuiSelect-select': {
      color: '#000000',
      paddingRight: theme.spacing(4),
    },
    '& .MuiInputLabel-root': {
      color: '#000000',
      fontSize: '1.2em',
      textAlign: 'center',
    },
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
  },
}))

export const ManagerFilter = ({ selectedManager, handleManagerChange, managers}) => {
  const classes = managerFilterStyles();

  const [activeManagers, setActiveManagers] = useState([]);


  useEffect(() => {
    if (managers && managers.length !== 0){
      let temp_activeManagers = [];
      for (let manager of managers){
        temp_activeManagers.push(manager)
      }
      setActiveManagers(temp_activeManagers)
    }
  }, [managers])

  
  return (
    <FormControl className={classes.formControl}>
    {activeManagers && (selectedManager || selectedManager === "") ? (
      <Select
        labelId="manager-select-label"
        id="manager-select"
        value={(selectedManager && selectedManager !== "") ? selectedManager.details.username : "All Managers"}
        onChange={handleManagerChange}
      >
        <MenuItem className={classes.menuItem} value={"All Managers"}>All Managers</MenuItem>
        {activeManagers.map((manager) => (
          <MenuItem className={classes.menuItem} key={manager.id} value={manager.details.username}>
            {manager.details.username}
          </MenuItem>
        ))}
      </Select>
    ): <></>}
    </FormControl>
  );
}

const playerFilterStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #000000',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
    '& .MuiSelect-icon': {
      color: '#000000',
    },
    '& .MuiSelect-select': {
      color: '#000000',
      paddingRight: theme.spacing(4),
    },
    '& .MuiInputLabel-root': {
      color: '#000000',
      fontSize: '1.2em',
      textAlign: 'center',
    },
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
  },
}))

export const PlayerFilter = ({ selectedPlayers, handlePlayersChange }) => {
  const classes = playerFilterStyles();
  
  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="player-select-label"
        id="player-select"
        value={selectedPlayers || "All Players"}
        onChange={handlePlayersChange}
      >
        <MenuItem className={classes.menuItem} value={"All Players"}>All Players</MenuItem>
        <MenuItem className={classes.menuItem} value={"Free Agents"}>Free Agents</MenuItem>
        <MenuItem className={classes.menuItem} value={"All Taken"}>All Taken</MenuItem>
      </Select>
    </FormControl>
  );
}

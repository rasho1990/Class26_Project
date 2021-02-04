import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper, InputBase, IconButton } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    margin: 'auto',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
}));

const SearchBar = ({
  inputSearchHandler,
  onSubmitSearchHandler,
  searchValue,
  placeholder,
}) => {
  const classes = useStyles();
  return (
    <Container>
      <Paper
        component='form'
        className={classes.root}
        onSubmit={onSubmitSearchHandler}
      >
        <InputBase
          className={classes.input}
          placeholder={placeholder}
          inputProps={{ 'aria-label': '' }}
          value={searchValue}
          onChange={inputSearchHandler}
        />
        <IconButton
          type='submit'
          className={classes.iconButton}
          aria-label='search'
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Container>
  );
};

export default SearchBar;

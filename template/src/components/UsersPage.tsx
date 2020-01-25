import { useQuery } from '@apollo/react-hooks';
import { Container, GridList, GridListTile, withStyles, Fab } from '@material-ui/core';
import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { GET_USERS, UsersData } from '../queries/UserQuery';
import UserDialog from './UserDialog';
import UserPage from './UserPage';
import { User } from '../models/UserModel';
import { DialogAction } from '../models/CommonModel';
import { globalStoreManager } from '../store';

/**
 * @description holds user list component
 */

// style properties
type StyleProps = {
  classes: any
}

type Props = StyleProps;

/**
 * User List Component
 * @param props properties
 */
const UsersPage = (props: Props) => {
  // sends get users query to graphql server
  const { loading, data, error } = useQuery<UsersData, {}>(
    GET_USERS
  );

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { classes } = props;

  /**
   * updates user list with updated / created / deleted user
   * @param user user instance
   * @param action dialog action
   */
  const updateState = (user: User, action: DialogAction) => {
    if (data && data.users) {
      if (action === DialogAction.Edit || action === DialogAction.Delete) {
        let oldUserIndex = data.users.map(u => {
          return u.id;
        }).indexOf(user.id);
        if (oldUserIndex != null && oldUserIndex >= 0) {
          if (action === DialogAction.Edit) {
            data.users[oldUserIndex] = user;
          } else if (action === DialogAction.Delete) {
            data.users.splice(oldUserIndex, 1);
          }
        }
      } else if(action === DialogAction.New) {
        data.users.push(user);
      }
    }
    setLastUpdated(new Date());
  }

  /**
   * opens user dialog on create mode
   */
  const openCreateDialog = () => {
    const {userDialog} = globalStoreManager.getGlobalStore();
    userDialog.openDialog({} as User, DialogAction.New);
  }
  
  return (
    <Container className={classes.container} id={lastUpdated.toDateString()}>
      <Fab variant="extended" onClick={openCreateDialog}>
        <AddIcon className={classes.extendedIcon} />
        Add New User
      </Fab>
      <div className={classes.userList}>
      {
        loading ? (
          <p>Loading ...</p>
        ) : 
        error ? (
          <p>{error.message}</p>
        ) : (
          <GridList cellHeight={200} className={classes.gridList} cols={4}>
            {data && data.users.map(user => (
              <GridListTile key={user.id}><UserPage user={user} /></GridListTile>
            ))}
          </GridList>
        )
      }
      </div>
      <UserDialog onCallback={updateState} />
    </Container>
  );
}

export default withStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
  },
  userList: {
    marginTop: theme.spacing(3),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}))(UsersPage);

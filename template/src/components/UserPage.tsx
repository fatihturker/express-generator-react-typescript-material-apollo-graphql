import { Button, Card, CardActions, CardContent, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { DialogAction } from '../models/CommonModel';
import { User } from '../models/UserModel';
import { globalStoreManager } from '../store';

/**
 * @description holds user component
 */

// user properties
type UserProps = {
  user: User
}

// style properties
type StyleProps = {
  classes: any
}

// user state
type UserState = {
}

type Props = UserProps & StyleProps;
type State = UserState;

/**
 * User component
 */
class UserPage extends React.PureComponent<Props, State> {
  /**
   * opens dialog using userDialog instance attached to global store
   * @param {User} user user instance
   * @param {DialogAction} action identifies dialog action
   */
  openDialog = (user: User, action: DialogAction) => {
    const {userDialog} = globalStoreManager.getGlobalStore();
    userDialog.openDialog(user, action);
  }
  
  /**
   * renders the user component
   */
  render() {
    const {user, classes} = this.props;
    return (
      <Card className={classes.card} variant="outlined">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
           {user.name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Id: {user.id}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Email: {user.email}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" 
            className={classes.cardAction} onClick={e => this.openDialog(user, DialogAction.Edit)}>
              Edit
          </Button>
          <Button variant="contained" color="secondary" 
            className={classes.cardAction} onClick={e => this.openDialog(user, DialogAction.Delete)}>
              Delete
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(theme => ({
  card: {
    maxWidth: 345,
    height: "98%",
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardAction: {
    width: "50%",
  },
}))(UserPage);
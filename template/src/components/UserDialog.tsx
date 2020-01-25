import { Mutation } from 'react-apollo'
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { DialogAction } from '../models/CommonModel';
import { User } from '../models/UserModel';
import { CREATE_USER, DELETE_USER, UPDATE_USER } from '../mutations/UserMutation';
import { globalStoreManager } from '../store';

/**
 * @description holds user dialog
 */

// Style properties
type StyleProps = {
  classes: any
}

// Dialog state
type DialogState = {
  isOpen: boolean, 
  action: DialogAction
}

// User state
type UserState = {
  user: User,
  email: String,
  password: String,
  name: String
}

// Callback properties / methods
type CallbackProps = {
  onCallback(user: User, action: DialogAction)
}

type Props = StyleProps & CallbackProps;
type State = DialogState & UserState;


/**
 * User Dialog Component
 */
class UserDialog extends React.PureComponent<Props, State> {
  /**
   * sets initial state and attaches user dialog to global state
   * @param {Props} props component properties
   */
  constructor(props: Props) {
    super(props);
    const user: User = {} as User;
    this.state = {
      user: user,
      email: "",
      password: "",
      name: "",
      isOpen: false,
      action: DialogAction.New
    }
    globalStoreManager.attachGlobalObject(this, "userDialog");
  }

  /**
   * opens user dialog with user instance and action
   * @param {User} user user instance
   * @param {DialogAction} action identifies dialog action
   */
  openDialog = (user: User, action: DialogAction) => {
    this.setState({
      isOpen: true, 
      user: user, 
      name: user.name,
      password: user.password,
      email: user.email,
      action: action
    });
  }

  /**
   * renders the user dialog component
   */
  render() {
    const { name, password, email, user, isOpen, action } = this.state;
    const { onCallback } = this.props;

    /**
     * sets email state
     * @param {String} email user email
     */
    const handleEmailChanged = (email: string) => {
      user.email = email;
      this.setState({email: email, user: user});
    };

    /**
     * sets name state
     * @param {String} name user name
     */
    const handleNameChanged = (name: string) => {
      user.name = name;
      this.setState({name: name, user: user});
    };

    /**
     * sets password state
     * @param {String} password user password
     */
    const handlePasswordChanged = (password: string) => {
      user.password = password;
      this.setState({password: password, user: user});
    };
    
    /**
     * closes user dialog
     */
    const handleClose = () => {
      this.setState({isOpen: false});
    };

    return (
      <div>
        <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{user ? user.id: ""}</DialogTitle>
          <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              id="Username"
              label="Username"
              type="text"
              fullWidth
              value={name}
              onChange = {
                e => {
                  handleNameChanged(e.target.value);
                }
              }
              disabled={action === DialogAction.Delete}
            />
            {
              action === DialogAction.New ? 
              <TextField
              margin="dense"
              id="Password"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange = {
                e => {
                  handlePasswordChanged(e.target.value);
                }
              }
            /> : null
            }
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange = {
                e => {
                  handleEmailChanged(e.target.value);
                }
              }
              disabled={action === DialogAction.Delete}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {
              action === DialogAction.New ? 
              <Mutation mutation={CREATE_USER}
                onCompleted = { 
                  data => {
                    // on mutation completed, call onCallback method with user data and closes the dialog
                    onCallback(data.createUser, action);
                    handleClose();
                  }
                }
              >
                {
                  createUser => 
                  (
                    <Button onClick={
                      () => {
                        // sends create user mutation to graphql server
                        createUser({ variables: { input: user } });
                      } 
                    }
                    color="primary">
                      Create
                    </Button>
                  )
                }
              </Mutation>
              : action === DialogAction.Edit ? 
              <Mutation mutation={UPDATE_USER} 
                onCompleted = { 
                  data => {
                    // on mutation completed, call onCallback method with user data and closes the dialog
                    onCallback(data.updateUser, action);
                    handleClose();
                  }
                }
              >
                {
                  updateUser => 
                  (
                    <Button onClick={
                      () => {
                        // sends update user mutation to graphql server
                        updateUser({ variables: { input: user } });
                      } 
                    } 
                    color="primary">
                      Edit
                    </Button>
                  )
                }
              </Mutation>
              : action === DialogAction.Delete ? 
              <Mutation mutation={DELETE_USER}
                onCompleted = { 
                  data => {
                    // on mutation completed, call onCallback method with user data and closes the dialog
                    onCallback(data.deleteUser, action);
                    handleClose();
                  }
                }
              >
                {
                  deleteUser => 
                  (
                    <Button onClick={
                      () => {
                        // sends delete user mutation to graphql server
                        deleteUser({ variables: { input: user.id } });
                      } 
                    } 
                    color="primary">
                      Delete
                    </Button>
                  )
                }
              </Mutation>
              : <Button onClick={handleClose} color="primary">No Action</Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
}

export default withStyles(theme => ({
  
}))(UserDialog);
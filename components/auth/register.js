import React from 'react';
import firebase from '../../firebase';
import md5 from 'md5';

import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errors: [],
            loading: false,
            usersRef: firebase.database().ref("users")
        }   
    }

    isFormEmpty = ({username, email, password, passwordConfirmation}) => {
        
        return(
            !username.length || 
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
        )
    }


    isPasswordValid = ({password, passwordConfirmation}) => {
        
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false
        }
        else if(password !== passwordConfirmation){
            return false
        }
        else{
            return true
        }
    }
    
    displayErrors = (errors) => {
        
        return errors.map((error, i) => {
            return <p key={i}>{error.message}</p>
        })
    }

    // displayErrors = errors =>
    // errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = (event) => {
        
        this.setState({
            [event.target.name] : event.target.value
        })

    }

    handleSubmit = (event) => {

        event.preventDefault();
        //firebase

        // this.setState({
        //     username: '',
        //     email: '',
        //     password: '',
        //     passwordConfirmation: ''
        // })

        if(this.isFormValid()){

            this.setState({
                errors: [],
                loading: true
            })

            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((createdUser) => {
                    console.log(createdUser)

                    

                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `https://gravatar.com/avatar/${md5(createdUser.user.email)}?id=identicon`
                    })
                    .then(()=>{
                        //udpate dabase
                        this.saveUser(createdUser)
                        .then(() => {
                            
                            this.setState({
                                loading: false
                            })

                            console.log('user saved')
                
                        })
                        
                    })
                    .catch((err)=>{
                        console.log(err)

                        this.setState({
                            errors: this.state.errors.concat(err),
                            loading: false
                        })
                    })


                })
                .catch((err) => {
                    console.log(err)

                    this.setState(
                    {
                        errors: this.state.errors.concat(err),
                        loading: false
                    }
                    )
                })
        }

    }

    isFormValid = () => {
        
        let errors = [];
        let error;
        //pass state to function

        if(this.isFormEmpty(this.state)){
            // throw error
            //want the result to be false so that function doesn't execute
            error = {message: "Fill in all fields"};
            
            this.setState({
                errors: errors.concat(error)
            })
        }
        else if(!this.isPasswordValid(this.state)){
            // throw error
            //we want the result to be true

            error = {message: "password is invalid"}

            this.setState({
                errors: errors.concat(error)
            })
        }
        else{
            //for is valid

            return true
        }
    }

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) 
        ? "error"
        : ""
    }

    saveUser = (createdUser) => {
        
        return this.state.usersRef.child(createdUser.user.uid)
        .set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }
    
    


    render() {

        const {username, email, password, passwordConfirmation, errors, loading} = this.state;
        
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange"/>
                        Register for DC Chat
                        
                    </Header>

                    <Form onSubmit={this.handleSubmit}>
                        <Segment>
                            <Form.Input fluid name="username" value={username} icon="user" iconPosition="left"
                            placeholder="Username" type="text"  onChange={this.handleChange} />

                            <Form.Input fluid name="email" value={email} icon="mail" iconPosition="left"
                            className={this.handleInputError(errors, "email")}
                            placeholder="Email Address" type="text" onChange={this.handleChange} />

                            <Form.Input fluid name="password" value={password} icon="lock" iconPosition="left"
                            className={this.handleInputError(errors, "password")}
                            placeholder="Password" type="password" onChange={this.handleChange} />

                            <Form.Input fluid name="passwordConfirmation" value={passwordConfirmation} icon="repeat" iconPosition="left"
                            className={this.handleInputError(errors, "password")}
                            placeholder="Password Confirmation" type="password" onChange={this.handleChange} />

                            <Button color="orange"
                            className={loading ? "loading" : ""} 
                            fluid size="large">Submit</Button>
                        </Segment>

                        
                    </Form>

                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}

                    <Message>Already a user? <Link to="/login">Login</Link> </Message>

                </Grid.Column>
            </Grid>
        );
    }
}


export default Register
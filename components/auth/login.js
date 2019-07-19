import React from 'react';
import firebase from '../../firebase';


import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
            email: '',
            password: '',
            errors: [],
            loading: false,
            
        }   
    }

    

    
    
    displayErrors = (errors) => {
        
        return errors.map((error, i) => {
            return <p key={i}>{error.message}</p>
        })
    }

    isFormEmpty = ({email, password }) => {
        //if length exists, then it's true want to return the opposite of true
        // if length of zero for any of these, then return from this function true
        // if length exists, then opposite is false.
        //if length of zero,then opposite of that is true.
        //answer the question isFromEmpty
        return (
            
            !email.length ||
            !password.length 
            );
        };

    isPasswordValid = ({ password}) => {
        if (password.length < 6 ) {
            return false;
        } else {
            return true;
        }
    };

    isFormValid = () => {
        let errors = [];
        let error;
    
        if (this.isFormEmpty(this.state)) {
            error = { message: "Fill in all fields" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: "Password is invalid" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    };

    // displayErrors = errors =>
    // errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = (event) => {
        
        this.setState({
            [event.target.name] : event.target.value
        })

    }

    handleSubmit = (event) => {

        event.preventDefault();
        

        if(this.isFormValid()){

            this.setState({
                errors: [],
                loading: true
            }, ()=>{
                firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((signedInUser) => {
                    console.log(signedInUser)

                    this.setState({
                        loading: false
                    })
                })
                .catch((err)=>{
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    })
                })
                })
        }

    }

    

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) 
        ? "error"
        : ""
    }

    
    
    


    render() {

        const {email, password,  errors, loading} = this.state;
        
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h2" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet"/>
                        Login to DC Chat
                        
                    </Header>

                    <Form onSubmit={this.handleSubmit}>
                        <Segment>
                            

                            <Form.Input fluid name="email" value={email} icon="mail" iconPosition="left"
                            className={this.handleInputError(errors, "email")}
                            placeholder="Email Address" type="text" onChange={this.handleChange} />

                            <Form.Input fluid name="password" value={password} icon="lock" iconPosition="left"
                            className={this.handleInputError(errors, "password")}
                            placeholder="Password" type="password" onChange={this.handleChange} />

                            

                            <Button color="violet"
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

                    <Message>Don't have an account <Link to="/register">Register</Link> </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
export default Login
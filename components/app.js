import React, {Component} from 'react';

    
class App extends Component {
    state = {
        productcolors: []
    }
    render() {
        return (
            <div className="container">
                <div className="col-xs-12">
            <h1>My Colors</h1>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Example Liked</h5>
                        <h6 className="card-subtitle mb-2 text-muted">Completed</h6>
                    </div>
                </div>
                </div>
            </div>
        );
    }
    }

export default App;
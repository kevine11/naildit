import React from 'react';

class Background extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            productcolor: [],
        };
    }

    componentDidMount(){

        fetch('https://makeup-api.herokuapp.com/api/v1/products.json?product_type=nail_polish')
        .then(results => {
            return results.json();

        })
        .then(data => {
            let productcolors = data.results.map((colors) =>{
                return
                <div key={colors.results}>
                    {/* <colors.colour_name> */}
                </div>
            })
            this.setState({colour_name : colour_name});
            console.log("color", this.state.colour_name)
        })
    }




    render() {
        return (
            <div className="Container2">
                <div className="Container1">
                    {this.state.colour_name}
                </div>
            </div>    

        );
    }
}

export default Background;
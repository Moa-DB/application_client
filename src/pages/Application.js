import React, {Component} from "react";
import ApplicationForm from '../components/ApplicationForm';



class Application extends Component{

    constructor(props) {
        super(props)

        this.state = {
        }
    }
    render(){
        return (
            <div>
                <ApplicationForm/>
            </div>
        )
    }
}

export default Application;
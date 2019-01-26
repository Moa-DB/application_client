import React, {Component} from "react";
import RegistrationForm from '../components/RegistrationForm';
import ApplicationForm from "../components/ApplicationForm";

class Register extends Component{

    constructor(props) {
        super(props)

        this.state = {
        }
    }
    render(){
        return (
            <div>
                <RegistrationForm/>
            </div>
        )
    }
}

export default Register;
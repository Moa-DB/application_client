import React, { Component } from 'react';
import {server} from '../config';
import './ApplicationForm.css';


/**
 * Lets the user create an application in three steps. Step one lets the user choose competence from a drop down list and
 * write number of years in that competence in a input field. Step two lets the user add time periods to the application
 * by giving two dates as input. Step three lets the user view the application and then hand it in or cancel.
 */
class ApplicationForm extends Component {
    constructor() {
        super();

        this.state = {
            chooseCompetenceProfile: true,
            chooseAvailability: false,
            showMenu: false,
            competences: null,
            selectedCompetenceProfiles: [],
            selectedAvailabilities: [],
            competence: "",
            years: 0.0,
            fromDate: null,
            toDate: null,
            overView: false,
            donePicking: false,

        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSubmitCompetenceProfile = this.onSubmitCompetenceProfile.bind(this);
        this.fetchCompetences = this.fetchCompetences.bind(this);
        this.onContinue = this.onContinue.bind(this);
        this.onSubmitAvailability = this.onSubmitAvailability.bind(this);
        this.removeCompetenceProfile = this.removeCompetenceProfile.bind(this);
        this.removeAvailability = this.removeAvailability.bind(this);
        this.onChangeApplication = this.onChangeApplication.bind(this);
        this.sendApplication = this.sendApplication.bind(this);
        this.showApplication = this.showApplication.bind(this);
        this.reset = this.reset.bind(this);
    }


    componentDidMount() {
        let today = new Date();
        this.setState({
            fromDate: today,
            toDate: today + 1,

        })
        this.fetchCompetences();
    }

    /**
     * GETs all the competences from the server.
     */
    fetchCompetences() {
        fetch(server + "/competences",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then(data => this.setState({competences: data, competence: data[0].name}))
            .catch(e => console.log(e))
    }

    /**
     * Handles changed selection in the competence selector.
     * @param event
     */
    handleSelect(event) {
        this.setState({competence: event.target.value});
    }

    /**
     * Handles input from the input fields.
     * @param event
     */
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    /**
     * Drop down list which displays all the competences fetched from the server and lets the user select a competence.
     * @returns {*}
     */
    selectCompetence() {
        if(this.state.competences !== null){
            return <div >
                <p className="FormText">select competence below:</p>
                <select name="competence" value={this.state.competence} onChange={this.handleSelect}>
                    { this.state.competences.map((competence) =>
                        <option
                            value={competence.name}
                            key={competence.name} >{competence.name}
                        </option>)
                    }
                </select>
            </div>;

        }
    }

    /**
     * Input which lets the user give a double representing number of years in a competence.
     * @returns {*}
     */
    selectYears(){
        return(
                <label>
                    <p className="FormText">write years of experience in {this.state.competence.toLocaleLowerCase()} below:</p>
                <input
                    id={"years"}
                    name="years"
                    type="text"
                    value={this.state.years}
                    onChange={this.handleInputChange}/>
                </label>
        )
    }

    /**
     * Creates a "Competence Profile" object from the selected competence and given years of experience, and adds
     * it to the list of "selectedCompetenceProfiles".
     */
    onSubmitCompetenceProfile(){
        let competencesArray = this.state.selectedCompetenceProfiles;
        competencesArray.map((competenceProfile, index) =>
        competenceProfile.competence === this.state.competence ?
            competencesArray.splice(index,1) : null
        )
        competencesArray.push({
            "competence": this.state.competence,
            "years_of_experience": this.state.years
        })
        this.setState({
            selectedCompetenceProfiles: competencesArray,
            years: 0.0,

        })
    }

    /**
     *Returns true if the given dates are invalid in some way. mapFrom and mapTo represents a time frame given earlier.
     * testFrom and testTo are the new time frame that the user wants to add.
     * @param mapFrom
     * @param mapTo
     * @param testFrom
     * @param testTo
     * @returns {boolean}
     */
    checkDatesTaken(mapFrom, mapTo, testFrom, testTo){
        if(mapFrom <= testFrom && testFrom <= mapTo)return true;
        if(mapFrom <= testTo && testTo <= mapTo)return true;
        if(testFrom < mapFrom && mapTo < testTo)return true;
        if(testFrom >= testTo)return true;
    }

    /**
     * Iterates trough all created "Competence Profiles" and displays them as list items with a delete button to
     * delete individual elements.
     * @returns {*}
     */
    selectedCompetences(){
        if(this.state.selectedCompetenceProfiles.length > 0){
            return <div className="ListAll">
                <p className="FormText">You have chosen the competence profiles listed below:</p>
                <ul>
                { this.state.selectedCompetenceProfiles.map((competenceProfile, index) =>
                    <li key={"l" + competenceProfile.competence}>
                        {competenceProfile.competence + ", " + competenceProfile.years_of_experience + " years"}
                        <button
                            className="X"
                            onClick={()=>this.removeCompetenceProfile(index)}
                            name="X"
                            key={"b" + competenceProfile.competence} >X
                        </button>
                    </li>)
                }
                </ul>
            </div>;

        }
    }

    /**
     * Removes a "Competence Profile" object from the list.
     * @param index
     */
    removeCompetenceProfile(index){
        let competencesArray = this.state.selectedCompetenceProfiles;
        competencesArray.splice(index, 1);
        this.setState({
            selectedCompetenceProfiles: competencesArray,
        })
    }

    /**
     * Generates input fields for giving a to and from date to create an "Availability" time frame.
     * @returns {*}
     */
    selectAvailability(){
       return (<div>

           <label>
               <p className="FormText">from date:</p>
                <input
                    name="fromDate"
                    type="date"
                    value={this.state.fromDate}
                    onChange={this.handleInputChange}/>
            </label>
           <br/>
            <label>
                <p className="FormText">to date:</p>
                <input
                    name="toDate"
                    type="date"
                    value={this.state.toDate}
                    onChange={this.handleInputChange}/>
            </label>

       </div>)
    }

    /**
     * Iterates trough the list of created "Availabilities" and checks if the newly created time frame is valid.
     * If valid a availability object is created and added to the list of created availabilities.
     */
    onSubmitAvailability(){
        let availabilitiesArray = this.state.selectedAvailabilities;
        let dateCollision = false;
        availabilitiesArray.map((availability, index) =>
            this.checkDatesTaken(availability.from, availability.to, this.state.fromDate, this.state.toDate) ?
                dateCollision = true : null)

        if(!dateCollision){
            availabilitiesArray.push({
                "from": this.state.fromDate,
                "to": this.state.toDate
            })
            this.setState({
                selectedAvailabilities: availabilitiesArray,
            })
        }
        else{
            alert("The time frame you have chosen overlaps one of your previously selected time frames or you have given a later from date than the to date." +
                "Please delete the old time frame or choose another that does not overlap any other time frames.")
        }
    }

    /**
     * Iterates trough all created "Availabilities" and displays them as list items with a delete button to
     * delete individual elements.
     * @returns {*}
     */
    selectedAvailabilities(){
        if(this.state.selectedAvailabilities.length > 0){
            return <div className="ListAll">
                <p className="FormText">You have chosen the availabilities listed below:</p>
                <ul>
                { this.state.selectedAvailabilities.map((availability, index) =>
                    <li key={availability.from + availability.to}>{"from: " + availability.from + ", to: " + availability.to}
                        <button
                            className="X"
                            onClick={()=>this.removeAvailability(index)}
                            name="X"
                            key={availability.from + availability.to}>X
                        </button>
                    </li>)
                }
                </ul>
            </div>;
        }
    }

    /**
     * Removes an "Availability"
     * @param index
     */
    removeAvailability(index){
        let availabilityArray = this.state.selectedAvailabilities;
        availabilityArray.splice(index, 1);
        this.setState({
            selectedAvailabilities: availabilityArray,
        })
    }

    /**
     * Used to modify state parameters that determine what view is rendered.
     */
    onContinue(){
        if(this.state.chooseAvailability){
            this.setState({
                overView: true
            })
        }
        this.setState({
            chooseCompetenceProfile: false,
            chooseAvailability: true,
        })
    }

    /**
     * Used to modify state parameters that determine what view is rendered.
     * @param status
     */
    onChangeApplication(status){
        if(status === "Availabilities" && this.state.chooseCompetenceProfile && this.state.donePicking){
            status = "overView";
        }
        this.setState({
            chooseCompetenceProfile: status === "CompetenceProfiles",
            chooseAvailability: status === "Availabilities",
            overView: status === "overView",
        }, ()=> status === "overView" ? this.setState({donePicking: true}) : null);
    }

    /**
     * Iterates trough all "Competence Profiles" and "Availabilities" created and added by the user, to display an
     * overview of the application to the user.
     * @returns {*}
     */
    showApplication(){
        return(
            <div id={"showApplication"}>
                <h2>Competence profiles: </h2>
                <ul>
                {this.state.selectedCompetenceProfiles.map((competenceProfile, index) =>
                    <li key={"l" + competenceProfile.competence}>
                        {competenceProfile.competence + ", " + competenceProfile.years + " years"}
                    </li>)}</ul><br/>
                <h2>Availabilities: </h2>
                <ul>
                {this.state.selectedAvailabilities.map((availability, index) =>
            <li key={availability.from + availability.to}>{"from: " + availability.from + ", to: " + availability.to}
            </li>)}
                </ul>
            </div>)
    }

    /**
     * Arranges the user created "Competence Profiles" and "Availabilities" in a form the server is expecting. Then
     * posts the object as JSON. On success, the state is reset.
     */
    sendApplication(){
        if(this.state.selectedCompetenceProfiles.length < 1 || this.state.selectedAvailabilities.length < 1) {
            alert("Please add at least one competence profile and availability")
            return;
        }

        let application = {
            "competences": this.state.selectedCompetenceProfiles,
            "available": this.state.selectedAvailabilities,
        }

        fetch(server + '/applications', {
            credentials: 'include',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(application),
        }).then((response) => {
            if(!response.ok)
                return response.json();
            else
                return response;
        }).then((response) => {
            if(!response.ok) throw new Error(response.message);
            else return response;
        }).then((data) => {
            alert("Application posted!");
            this.reset();
        }).catch((error) => {
            alert(error);
        });
    }

    /**
     * Resets the state. Some parameters are not reset to avoid null variables.
     */
    reset(){
        this.setState({
            chooseCompetenceProfile: true,
            chooseAvailability: false,
            showMenu: false,
            selectedCompetenceProfiles: [],
            selectedAvailabilities: [],
            years: 0.0,
            overView: false,
            donePicking: false,
        })
    }


    render() {


        if(this.state.overView){
            return (
                <div className={"OuterDiv"}>
                    {this.showApplication()}
                    <br/>
                    <button name="submit" onClick={()=>this.onChangeApplication("CompetenceProfiles")} >Change competence profiles</button>
                    <button name="submit" onClick={()=>this.onChangeApplication("Availabilities")} >change availabilities</button>
                    <br/>
                    <br/>
                    <button name="send" onClick={this.sendApplication} >hand in application</button>
                    <br/>
                    <br/>
                    <button name="cancel" onClick={this.reset} >cancel</button>
                </div>
            );
        }
        else if (this.state.chooseCompetenceProfile){
            return (
                <div className={"OuterDiv"}>
                        <h1>Please choose competence and then write the number of years in that expertise. You are allowed to choose multiple competence profiles.</h1>
                        <br/>
                        <br/>
                    {this.selectedCompetences()}
                    <div className="All">
                        <br/>
                        {this.selectCompetence()}
                        <br/>
                        {this.selectYears()}
                        <br/>
                        <button name="submit" onClick={this.onSubmitCompetenceProfile} >add to application</button>
                    </div>
                    <br/>
                    <button name="submit" onClick={()=>this.onChangeApplication("Availabilities")} >continue</button>
                </div>
                )
        }
        else if(this.state.chooseAvailability){
            return (
                <div className={"OuterDiv"}>
                    <h1>Please choose from and to dates for the time intervals that you are available. You are allowed to choose multiple time frames.</h1>
                    <br/>
                    <br/>
                    {this.selectedAvailabilities()}
                <div className="All">
                    <br/>
                    {this.selectAvailability()}
                    <br/>
                    <button name="submit" onClick={this.onSubmitAvailability} >add to application</button>
                </div>
                    <br/>
                    <button name="submit" onClick={()=>this.onChangeApplication("overView")} >continue</button>
                </div>
            )
        }
    }
}

export default ApplicationForm;
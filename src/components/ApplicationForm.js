import React, { Component } from 'react';
import {server} from '../config';
import './ApplicationForm.css';


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
    }


    componentDidMount() {
        var today = new Date();
        this.setState({
            fromDate: today,
            toDate: today + 1,

        })
        this.fetchCompetences();
    }

    fetchCompetences() {
        fetch(server + "/competences",
            {credentials: 'include'}
        )
            .then(res => res.json())
            .then(data => this.setState({competences: data, competence: data[0].name}))
            .catch(e => console.log(e))
    }

    handleSelect(event) {
        this.setState({competence: event.target.value});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    selectCompetence() {
        if(this.state.competences !== null){
            return <div >
                <p>select competence below:</p>
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

    selectYears(){
        return(
                <label>
                    <p>write years of experience in {this.state.competence.toLocaleLowerCase()} below:</p>
                <input
                    id={"years"}
                    name="years"
                    type="text"
                    value={this.state.years}
                    onChange={this.handleInputChange}/>
                </label>
        )
    }

    onSubmitCompetenceProfile(){
        let competencesArray = this.state.selectedCompetenceProfiles;
        competencesArray.map((competenceProfile, index) =>
        competenceProfile.competence === this.state.competence ?
            competencesArray.splice(index,1) : null
        )
        competencesArray.push({
            "competence": this.state.competence,
            "years": this.state.years
        })
        this.setState({
            selectedCompetenceProfiles: competencesArray,
            years: 0.0,

        })
    }

    checkDatesTaken(mapFrom, mapTo, testFrom, testTo){
        if(mapFrom <= testFrom && testFrom <= mapTo)return true;
        if(mapFrom <= testTo && testTo <= mapTo)return true;
        if(testFrom < mapFrom && mapTo < testTo)return true;
    }

    selectedCompetences(){
        if(this.state.selectedCompetenceProfiles.length > 0){
            return <div className="ListAll">
                <p>You have chosen the competence profiles listed below:</p>
                <ul>
                { this.state.selectedCompetenceProfiles.map((competenceProfile, index) =>
                    <li key={"l" + competenceProfile.competence}>
                        {competenceProfile.competence + ", " + competenceProfile.years + " years"}
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

    removeCompetenceProfile(index){
        let competencesArray = this.state.selectedCompetenceProfiles;
        competencesArray.splice(index, 1);
        this.setState({
            selectedCompetenceProfiles: competencesArray,
        })
    }

    selectAvailability(){
       return (<div>
           <label>
               <p>from date:</p>
                <input
                    name="fromDate"
                    type="date"
                    value={this.state.fromDate}
                    onChange={this.handleInputChange}/>
            </label>
           <br/>
            <label>
                <p>to date:</p>
                <input
                    name="toDate"
                    type="date"
                    value={this.state.toDate}
                    onChange={this.handleInputChange}/>
            </label></div>)
    }

    onSubmitAvailability(){
        let availabilitiesArray = this.state.selectedAvailabilities;
        let dateCollision = false;
        availabilitiesArray.map((availability, index) =>
            this.checkDatesTaken(availability.fromDate, availability.toDate, this.state.fromDate, this.state.toDate) ?
                dateCollision = true : null)

        if(!dateCollision){
            availabilitiesArray.push({
                "fromDate": this.state.fromDate,
                "toDate": this.state.toDate
            })
            this.setState({
                selectedAvailabilities: availabilitiesArray,
            })
        }
        else{
            alert("The time frame you have chosen overlaps one of your previously selected time frames. " +
                "Please delete the old time frame or choose another that does not overlap any other time frames.")
        }
    }

    selectedAvailabilities(){
        if(this.state.selectedAvailabilities.length > 0){
            return <div className="ListAll">
                <p>You have chosen the availabilities listed below:</p>
                <ul>
                { this.state.selectedAvailabilities.map((availability, index) =>
                    <li key={availability.fromDate + availability.toDate}>{"from date: " + availability.fromDate + ", to date: " + availability.toDate}
                        <button
                            className="X"
                            onClick={()=>this.removeAvailability(index)}
                            name="X"
                            key={availability.fromDate + availability.toDate}>X
                        </button>
                    </li>)
                }
                </ul>
            </div>;
        }
    }

    removeAvailability(index){
        let availabilityArray = this.state.selectedAvailabilities;
        availabilityArray.splice(index, 1);
        this.setState({
            selectedAvailabilities: availabilityArray,
        })
    }

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

    showApplication(){
        return(
            <div id={"showApplication"}><h2>Competence profiles: </h2>
                <ul>
                {this.state.selectedCompetenceProfiles.map((competenceProfile, index) =>
                    <li key={"l" + competenceProfile.competence}>
                        {competenceProfile.competence + ", " + competenceProfile.years + " years"}
                    </li>)}<br/>
                <h2>Availabilities: </h2>
                {this.state.selectedAvailabilities.map((availability, index) =>
            <li key={availability.fromDate + availability.toDate}>{"from date: " + availability.fromDate + ", to date: " + availability.toDate}
            </li>)}
                </ul>
            </div>)
    }

    sendApplication(){
        if(this.state.selectedCompetenceProfiles.length < 1 || this.state.selectedAvailabilities.length < 1) {
            alert("Please add at least one competence profile and availability")
            return;
        }
        let application = {
            "competenceProfiles": this.state.selectedCompetenceProfiles,
            "availabilities": this.state.selectedAvailabilities,
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
        }).catch((error) => {
            alert(error);
        });
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
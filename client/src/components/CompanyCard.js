import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CompanyCardStyles from '../styles/CompanyCard.js';
import axios from 'axios';


class CompanyCard extends Component{
  constructor(props){
    super(props);

    this.getPositions = this.getPositions.bind(this);
    this.getMajors = this.getMajors.bind(this);
    this.arrayToHTML = this.arrayToHTML.bind(this);
    this.mapIDToName = this.mapIDToName.bind(this);
    this.state = {majors: [], positions: []}
  }

  componentDidMount() {
    this.getPositions();
    this.getMajors();
  }

  getPositions = () => {
    var options = {
        params: {
          sort: 'name'
        }
      }
    axios.get('/companies/' + this.props.company.id + '/positions', options)
      .then(result => {
        let positionData = result.data.map(function(position) { 
          return position.position_id
        });

        this.setState({ 
          positions: positionData,
        });
      })
      .catch(err => console.log(err));
  }

  getMajors = () => {
    var options = {
        params: {
          sort: 'name'
        }
      }
    axios.get('/companies/' + this.props.company.id + '/majors')
      .then(result => {
        let majorData = result.data.map(function(majors) { 
          return majors.major_id
        });

        this.setState({ 
          majors: majorData,
        });
      })
      .catch(err => console.log(err));
  }

  //don't need to make this call for each card... extract out to row/company!

  mapIDToName = (idarray, namearray) => {
    //console.log(namearray)
    let elements = idarray.map(elem => {
      return namearray[elem];
    })
    return this.arrayToHTML(elements);
  }

  arrayToHTML = (array) => {
    let elements = array.map(elem => {
      //console.log(elem)
      if(elem){
        return (<li> {elem} </li>);
      }
  })
    return elements;
  }

//extract js into var out of html ...
  render(){
    const { classes } = this.props;
    let majors = this.state.majors;
    let allMajors = this.props.allMajors;

    let positions = this.state.positions;
    let allPositions = this.props.allPositions

    let positionsDisplay = (<Typography>
            Positions: {this.mapIDToName(positions, allPositions)}
          </Typography>)
    let majorsDisplay = (<Typography>
            Majors: {this.mapIDToName(majors, allMajors)}
          </Typography>)

    return (
        <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
            image={this.props.company.logo}
            title={this.props.company.name}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {this.props.company.name}
          </Typography>
          <Typography>
            Website: {this.props.company.website}
          </Typography>
          <Typography>
            Description: {this.props.company.description}
          </Typography>
          {majorsDisplay}
          {positionsDisplay}
          <Typography>
            Citizenship Requirement: {this.props.company.citizenship_requirement}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

CompanyCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(CompanyCardStyles)(CompanyCard);
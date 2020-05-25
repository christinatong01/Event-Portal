import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import {
	useOccupations,
	useDiets,
	usePositions,
	useMajors,
	useCompanies,
	useCheckboxes,
} from '../utils/misc-hooks.js';

function RegisterEWI(props) {
	const user_id = 3;
	const INITIAL_USER = {
		email: '',
		first_name: '',
		gpa: '',
		last_name: '',
		password: '',
		phone: '',
		swe_id: '',
		university_id: '',
		is_admin: false,
		occupation_ids: [], // array of occupations, each occupation has form { occupation_id: # }
		diet_ids: [],
		position_ids: [],
		ranks: [],
		major_ids: [], // array of majors, each having for { major_id: # }
		company_ids: [],
	};

	// get relevant information from database
	const { occupations } = useOccupations({});
	const { diets } = useDiets({});
	const { positions } = usePositions({});
	const { majors } = useMajors({});
	const { companies } = useCompanies({});

	// create state for all user information to be submitted to databse
	const [userDetails, setUserDetails] = useState(INITIAL_USER);

	useEffect(() => {
		axios
			.all([
				axios.get(`/users/${user_id}/id`),
				axios.get(`/users/${user_id}/occupations`),
				axios.get(`/users/${user_id}/diet`),
				axios.get(`/users/${user_id}/positions`),
				axios.get(`/users/${user_id}/majors`),
				axios.get(`/users/${user_id}/companies`),
			])
			.then(result => {
				console.log(result);
				let user_data = { ...result[0].data[0] };
				let user_occupations = [...result[1].data];
				let user_diets = [...result[2].data];
				let user_positions = [...result[3].data];
				let user_majors = [...result[4].data];
				let user_companies = [...result[5].data];
				console.log(user_data);
				console.log(user_occupations);
				console.log(user_diets);
				console.log(user_positions);
				console.log(user_majors);
				console.log(user_companies);

				// update the state with the fetched data
				setUserDetails(prev => {
					return {
						...prev,
						...user_data,
						occupation_ids: user_occupations,
						diet_ids: user_diets,
						position_ids: user_positions,
						major_ids: user_majors,
						company_ids: user_companies,
					};
				});
			})
			.catch(err => console.log(err));
		return () => {
			setUserDetails(INITIAL_USER);
		};
	}, [user_id, setUserDetails]);

	const handleChange = event => {
		const target = event.target;
		setUserDetails(prev => {
			return {
				...prev,
				[target.name]: target.value,
			};
		});
	};

	// handle in occupation select field changes
	const handleOccupationChange = event => {
		const target = event.target;
		console.log(target.value);

		// update state
		setUserDetails(prev => {
			return {
				...prev,
				occupation_ids: [
					{
						occupation_id: parseInt(target.value),
					},
				],
			};
		});
	};

	// handle POST request for new users
	const addUser = () => {
		console.log(userDetails);
		axios
			.post('/users/register', userDetails)
			.then(result => {
				console.log(result);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const updateUser = () => {
		console.log(userDetails);
		axios
			.put(`/users/${user_id}`, userDetails)
			.then(result => {
				console.log(result);
			})
			.catch(err => {
				console.log(err);
			});
	};

	// handle submission of form data
	const handleSubmit = event => {
		// Prevent site refresh after submission
		event.preventDefault();
		if (user_id) {
			updateUser();
		} else {
			addUser();
		}
	};

	const { classes } = props;
	const {
		first_name,
		last_name,
		password,
		email,
		phone,
		university_id,
		swe_id,
		gpa,
		is_admin,
		occupation_ids,
		diet_ids,
		position_ids,
		ranks,
		major_ids,
		company_ids,
	} = userDetails;

	// map occupations to select options
	let occupation_names = [];
	for (let id in occupations) {
		occupation_names.push(
			<MenuItem key={id} value={id}>
				{occupations[id]}
			</MenuItem>,
		);
	}

	// create checkbox components
	const { renderCheckboxes } = useCheckboxes(setUserDetails);
	let diet_names = renderCheckboxes(diets, diet_ids, 'diet_ids');
	let position_names = renderCheckboxes(
		positions,
		position_ids,
		'position_ids',
	);
	let major_names = renderCheckboxes(majors, major_ids, 'major_ids');

	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Typography component='h1' variant='h5'>
					Your Profile
				</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					{/* <div id={GOOGLE_BUTTON_ID}/> */}
					<TextField
						required
						fullWidth
						id='first_name'
						name='first_name'
						label='First Name'
						className={classes.textField}
						placeholder='e.g. John'
						value={first_name || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						required
						fullWidth
						id='last_name'
						name='last_name'
						label='Last Name'
						className={classes.textField}
						placeholder='e.g. Doe'
						value={last_name || ''}
						onChange={handleChange}
						margin='normal'
					/>

					<TextField
						required
						fullWidth
						id='university_id'
						name='university_id'
						label='UCLA ID'
						className={classes.textField}
						placeholder='e.g. 123456789'
						value={university_id || ''}
						onChange={handleChange}
						margin='normal'
					/>

					<FormLabel component='legend'>Enter your year</FormLabel>
					<Select
						required
						fullWidth
						className={classes.select}
						value={occupation_ids[0] ? occupation_ids[0].occupation_id : 1}
						onChange={handleOccupationChange}
						margin='normal'
						inputProps={{
							name: 'occupation_id',
							id: 'occupation_id',
						}}
					>
						{occupation_names}
					</Select>
					{/* <FormHelperText error className={classes.formHelperText}>
              {errorMessage}
            </FormHelperText> */}
					<TextField
						fullWidth
						id='email'
						name='email'
						label='Email'
						className={classes.textField}
						placeholder='e.g. example@example.com'
						value={email || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						id='phone'
						name='phone'
						label='Phone Number'
						className={classes.textField}
						placeholder='e.g. 7778889999'
						value={phone || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						id='swe_id'
						name='swe_id'
						label='SWE ID'
						className={classes.textField}
						placeholder='e.g. 408900876'
						value={swe_id || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						id='gpa'
						name='gpa'
						label='GPA'
						className={classes.textField}
						placeholder='e.g. 4.00'
						value={gpa || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<Typography component='h2' variant='h5'>
						Evening with Industry
					</Typography>
					<FormControl component='fieldset' className={classes.formControl}>
						<FormLabel component='legend'>Select your major(s)</FormLabel>
						<FormGroup>{major_names}</FormGroup>

						<FormLabel component='legend'>
							Select job level you are seeking
						</FormLabel>
						<FormGroup>{position_names}</FormGroup>

						<FormLabel component='legend'>Diet Preferences</FormLabel>
						<FormGroup>{diet_names}</FormGroup>
					</FormControl>
					<Typography component='h1' variant='h5'>
						Company choices
					</Typography>
					{/* <FormLabel component="company1">First Choice Company:</FormLabel>
              <Select
              required fullWidth
              className={classes.select}
              value={this.state.first_choice_company || ''}
              onChange={this.handleChange('first_choice_company')}
              margin='normal'>
              {company_names}
            </Select>
            <FormLabel component="company2">Second Choice Company:</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.second_choice_company || ''}
              onChange={this.handleChange('second_choice_company')}
              inputProps={{
                    name: 'Company ID',
                    id: 'company_id',
              }}
              margin='normal'>
              {company_names}
            </Select>
            <FormLabel component="company3">Third Choice Company</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.third_choice_company || ''}
              onChange={this.handleChange('third_choice_company')}
              inputProps={{
                    name: 'Company ID',
                    id: 'company_id',
              }}
              margin='normal'>
              {company_names}
            </Select> */}
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
						onClick={handleSubmit}
					>
						{user_id ? 'Update Profile' : 'Create Your Account'}
					</Button>
				</form>
			</Paper>
		</main>
	);
}

export default withStyles(ExamplePostFormStyles)(RegisterEWI);

/* 
import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import ExampleGet from '../components/ExampleGet.js';


const GOOGLE_BUTTON_ID = 'google-sign-in-button';


class RegisterEWI extends Component {
  
  componentDidMount ()
  {
    this.getCurrentUser();
    this.getMajors();
    this.getOccupations();
    this.getPositions();
    this.getDiets();
    this.getCompanies();
  }

  constructor() {
    super();

    // Initiate state
    this.state = { 
      user_id: null,
      occupation_ids: [],
      occupation_names: [],
      position_ids: [],
      position_names: [],
      diet_ids: [],
      diet_names: [],
      company_ids: [],
      company_names: [],
      major_names: [],
      phone_number: '',
      major_name: '',
      major_id: '',
      ucla_id: null,
      errorMessage: '',
      swe_id: '',
      email: '',
      first_choice_company: '',
      second_choice_company: '',
      third_choice_company: '',

      //user values
      occupation_id: null, //occupation name is really year
      occupation_name: null,
      occupations : {}, //<occupation name, occupation id
      diets : {},
      companies : {},

      major_checkboxes : {}, //<name, checked>
      position_checkboxes : {},
      diet_checkboxes : {}
    };
  }

  getCurrentUser = () => {
    const itemStr = localStorage.getItem("token")
    const item = JSON.parse(itemStr)
     axios.get(`/users/search?email=` + item.value) 
      .then(result => {
        this.setState({
          user_id: result.data[0].id
        });
      })
      .catch(err => {
        console.log(err);      
      });
  }

  getMajors = () => {
    axios.get('/majors')
      .then(result => {
        let m_map = {}
        let m_checkboxes = {}
        let m_names = result.data.map(function(major) { 
          m_map[major.name]=major.id
          m_checkboxes[major.name]=false
          return major.name 
        });
        this.setState({ 
          major_names: m_names,
          majors : m_map,
          major_checkboxes : m_checkboxes
        });

      })
      .catch(err => console.log(err));
  }

  getDiets = () => {
    axios.get('/diet')
      .then(result => {
        let d_map = {}
        let d_checkboxes = {}
        let d_names = result.data.map(function(diet) { 
          d_map[diet.type]=diet.id
          d_checkboxes[diet.type]=false
          return diet.type
        });
        this.setState({ 
          diet_names: d_names,
          diets : d_map,
          diet_checkboxes : d_checkboxes
        });

      })
      .catch(err => console.log(err));
  }

  getCompanies = () => {
    axios.get('/companies')
      .then(result => {
        let c_map = {}
        let c_names = result.data.map(function(company) { 
          c_map[company.name]=company.id
          return company.name 
        });
        this.setState({
          company_names : c_names,
          companies : c_map,
        });
      })
      .catch(err => console.log(err));
  }

  getOccupations = () => {
    axios.get('/occupations')
      .then(result => {
        let o_map = {}
        let o_names = result.data.map(function(occupation) { 
          o_map[occupation.name]=occupation.id
          return occupation.name 
        });
        this.setState({
          occupation_names : o_names,
          occupations : o_map
        });
      })
      .catch(err => console.log(err));
  }

  getPositions = () => {
    axios.get('/positions')
      .then(result => {
        let p_map = {}
        let p_checkboxes = {}
        let p_names = result.data.map(function(position) { 
          p_map[position.role]=position.id
          p_checkboxes[position.role]=false
          return position.role 
        });
        this.setState({ 
          position_names: p_names,
          positions : p_map,
          positions_checkboxes : p_checkboxes
        });

      })
      .catch(err => console.log(err));
  }

  

  handleCheckChangeMajor = name => event => {
    let m_checkboxes = this.state.major_checkboxes
    m_checkboxes[name] = event.target.checked
    console.log(m_checkboxes)
    console.log(this.state.major_checkboxes)
    this.setState({major_checkboxes : m_checkboxes})
    console.log(this.state.major_checkboxes[name])
  };

  handleCheckChangePosition = name => event => {
    this.state.position_checkboxes[name] = event.target.checked;
    console.log(this.state.position_checkboxes[name])
  };

  handleCheckChangeDiet = name => event => {
    this.state.diet_checkboxes[name] = event.target.checked;
    console.log(this.state.diet_checkboxes[name])
  };

  addUser = () => {
    if (!this.state.phone_number) {
      // Do not add major if no name specified
      console.log('ERROR: fill out phone number field.');
      //return;
    }

    let occupation_ids = []
    let occupation_name = this.state.occupation_name 
    if (occupation_name)
      occupation_ids.push(this.state.occupations[occupation_name])

    let major_ids = []
    let m_names = this.state.major_names

    //iterate through all major names, checking if checkbox is checked
    //if checkbox is checked then insert the major into the majors array for the user
    m_names.map(name => {
      if (this.state.major_checkboxes[name])
        major_ids.push(this.state.majors[name])
    });

    let position_ids = []
    let p_names = this.state.position_names

    p_names.map(name => {
      if (this.state.position_checkboxes[name])
        position_ids.push(this.state.positions[name])
    });

    let diet_ids = []
    let d_names = this.state.diet_names

    d_names.map(name => {
      if (this.state.diet_checkboxes[name])
        diet_ids.push(this.state.diets[name])
    });

    let first_company_id = null
    let first_company_name = this.state.first_choice_company
    let company_ids = []
    if (first_company_name) {
      first_company_id = this.state.companies[first_company_name]
      company_ids.push(first_company_id)
    }
    
    let second_company_id = null
    let second_company_name = this.state.second_choice_company
    if (second_company_name) {
      second_company_id = this.state.companies[first_company_name]
      company_ids.push(second_company_id)
    }

    let third_company_id = null
    let third_company_name = this.state.third_choice_company
    if (second_company_name) {
      third_company_id = this.state.companies[third_company_name]
      company_ids.push(third_company_id)
    }

    let body = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      password: "",
      email: this.state.email,
      phone: this.state.phone_number ? this.state.phone_number : null,
      university_id: this.state.ucla_id,
      is_admin: false,
      major_id: this.state.major_id,
      swe_id: this.state.swe_id ? this.state.swe_id : null,
      gpa: this.state.gpa ? this.state.gpa : null,
      occupation_id: occupation_ids,
      major_id: major_ids,
      position_id: position_ids,
      diet_id: diet_ids,
      company_id: company_ids,
      rank: ["First Choice","Second Choice","Third Choice"]

    };

    // Make POST request to add major
    axios.post('/users/register', body)
      .then(result => {

        
        // Clear form values 
        this.setState({
          phone_number: '',
          ucla_id: null,
          errorMessage: ''
        });
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      })
  }

  handleSubmit = (event) => {
    this.addUser();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  
  handleChange = name => event => {
    console.log("handleChangle")
    console.log(name)
    console.log(event.target.value)
    this.setState({
      [name]: event.target.value,
    });
    //add logic to prevent the first choice from being shown by second choice list
    //add logic to prevent second choice list from being added to third choice list
  };

  
  render() {
    const { classes } = this.props;
    const { check1, check2, check3 } = this.state;

    var occupation_names = this.state.occupation_names.map(name => {
      return <MenuItem key={name} value={name}>{name}</MenuItem>
    })

    var major_names = this.state.major_names.map(name => {

      return <FormControlLabel
          control={
            <Checkbox 
            checked={this.state.major_checkboxes[{name}]} 
            onChange={this.handleCheckChangeMajor(name)} 
            value={name} 
          />
        }
        label={name}
      />
    })

    var position_names = this.state.position_names.map(name => {

      return <FormControlLabel
          control={
            <Checkbox 
            checked={this.state.position_checkboxes[{name}]} 
            onChange={this.handleCheckChangePosition(name)} 
            value={name} 
          />
        }
        label={name}
      />
    })

    var diet_names = this.state.diet_names.map(name => {

      return <FormControlLabel
          control={
            <Checkbox 
            checked={this.state.diet_checkboxes[{name}]} 
            onChange={this.handleCheckChangeDiet(name)} 
            value={name} 
          />
        }
        label={name}
      />
    })

    var company_names = this.state.company_names.map(name => {
      return <MenuItem key={name} value={name}>{name}</MenuItem>
    })

    return (
      
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Your Profile
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <div id={GOOGLE_BUTTON_ID}/>
            <TextField
              required fullWidth
              id='first_name'
              label='First Name'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.first_name || ''}
              onChange={this.handleChange('first_name')}
              margin='normal'
            />
            <TextField
              required fullWidth
              id='last_name'
              label='Last Name'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.last_name || ''}
              onChange={this.handleChange('last_name')}
              margin='normal'
            />

            <TextField 
              required fullWidth
              id='ucla_id'
              label='UCLA ID'
              className={classes.textField}
              placeholder='e.g. 605105555'
              value={this.state.ucla_id || ''}
              onChange={this.handleChange('ucla_id')}
              margin='normal'
            />
          
            <FormLabel component="legend">Enter your year</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.occupation_name || ''}
              onChange={this.handleChange('occupation_name')}
              inputProps={{
                    name: 'Occupation ID',
                    id: 'occupation_id',
              }}
              margin='normal'>
              {occupation_names}
            </Select>
            <FormHelperText error className={classes.formHelperText}>
              {this.state.errorMessage}
            </FormHelperText>
            <TextField
              fullWidth
              id='email'
              label='Email'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.email || ''}
              onChange={this.handleChange('email')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='phone_number'
              label='Phone Number'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.phone_number || ''}
              onChange={this.handleChange('phone_number')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='swe_id'
              label='SWE ID'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.swe_id || ''}
              onChange={this.handleChange('swe_id')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='swe_id'
              label='GPA'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.gpa || ''}
              onChange={this.handleChange('gpa')}
              margin='normal'
            />
            <Typography component="h2" variant="h5">
              Evening with Industry
            </Typography>
             <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Select your major(s)</FormLabel>
              <FormGroup>
              {major_names}
              </FormGroup>

              <FormLabel component="legend">Select job level you are seeking</FormLabel>
              <FormGroup>
              {position_names}
              </FormGroup>

              <FormLabel component="legend">Diet Preferences</FormLabel>
              <FormGroup>
              {diet_names}
              </FormGroup>
              
            </FormControl>
            <Typography component="h1" variant="h5">
            Company choices
            </Typography>
            <FormLabel component="company1">First Choice Company:</FormLabel>
              <Select
              required fullWidth
              className={classes.select}
              value={this.state.first_choice_company || ''}
              onChange={this.handleChange('first_choice_company')}
              margin='normal'>
              {company_names}
            </Select>
            <FormLabel component="company2">Second Choice Company:</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.second_choice_company || ''}
              onChange={this.handleChange('second_choice_company')}
              inputProps={{
                    name: 'Company ID',
                    id: 'company_id',
              }}
              margin='normal'>
              {company_names}
            </Select>
            <FormLabel component="company3">Third Choice Company</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.third_choice_company || ''}
              onChange={this.handleChange('third_choice_company')}
              inputProps={{
                    name: 'Company ID',
                    id: 'company_id',
              }}
              margin='normal'>
              {company_names}
            </Select>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create Your Account
            </Button>
          </form>
        </Paper>
        <ExampleGet onRef={ref => (this.users = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExamplePostFormStyles)(RegisterEWI);
 */

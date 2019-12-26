import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';

import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';

const particleOptions = {
    particles: {
        number: {
            value: 120,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
}

// This here to change data when someone signs out
const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: '',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
    constructor() {
        super()
        this.state = initialState;
    }

    onInputChange = event => {
      this.setState({input: event.target.value});
      //Remove bounding box and image when input changes
      this.setState({box: []});
      this.setState({imageUrl: ''});
    }

    onKeyUp = (e) => {
      if (e.keyCode === 13) {
          this.onPictureSubmit();
      }
    }

    onPictureSubmit = () => {
      if(!this.state.input){
        this.setState({imageUrl: this.state.input})
        return;
      }
      this.setState({imageUrl: this.state.input}, () => {
        fetch('https://secret-shore-98981.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.imageUrl
            })
        })
        .then(response => response.json())
        .then( response => {
          if (response) {
            if(response === "Unable to work with API"){
              return;
            }
            fetch('https://secret-shore-98981.herokuapp.com/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}));//Object.assign(this.state.user, {entries: count}))//{ )
              /* 
              Find out why spread didn't work here
              Or using Object.assign() as below
              // this.setState(Object.assign({}, this.state.user, {entries: count}))
              */
            })
            .catch(console.log)
          }
          this.displayFaceBox(this.calcImageBox(response))
        })
        .catch( err =>  console.log(err))  
      });
    }

    // Collect data from the url and do some maths to get values for box
    calcImageBox = (data) => {
      const faceData = data.outputs[0].data.regions;
      const image = document.getElementById('face');
      const width = Number(image.width);
      const height = Number(image.height);
      const allFaces = [];

     if(faceData) {
        faceData.map( currentFace => {
          const currentFaceData = currentFace.region_info.bounding_box;

          allFaces.push( {
            id: currentFace.id,
            topRow: currentFaceData.top_row * height,
            rightCol: width - (currentFaceData.right_col * image.width),
            bottomRow: height - (currentFaceData.bottom_row * image.height),
            leftCol: currentFaceData.left_col * image.width
          });
          return true;
        });
      }
      return allFaces;
    }

    displayFaceBox = (boxDetails) => {
      this.setState({box: boxDetails})
    }

    onRouteChange = (route) => {
    	if (route === 'signout') {
    		this.setState(initialState);
    	} else if (route === 'home') {
    		this.setState({isSignedIn: true});
    	}
    	this.setState({route: route});
    }

    onUserAuthenticated = (data) => {
      this.setState({
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }
      });
    }

    render() {
      const { isSignedIn, route, box, imageUrl } = this.state;
       return (
          <div className="App">
            <Particles className='particles' params={particleOptions} />
            <Navigation onRouteChange={this.onRouteChange} isSignedIn={ isSignedIn } />
		        { 
        			route === 'home'
              ? <div>
                  <Logo />
                  <Rank 
                    name={ this.state.user.name } 
                    entries={ this.state.user.entries } 
                  />
                  <ImageLinkForm 
                     inputChange={this.onInputChange} 
                     pictureSubmit={this.onPictureSubmit}
                     keyUp={this.onKeyUp}/>
                  <FaceRecognition faceBox={box} faceImage={imageUrl}/>
                </div>
              : (
              	route === 'signin'
              		? <SignIn loadUser={this.onUserAuthenticated} onRouteChange={this.onRouteChange} />
              		: <Register loadUser={this.onUserAuthenticated} onRouteChange={this.onRouteChange} />
                )
            }
          </div>
        );
    }
 
}

export default App;

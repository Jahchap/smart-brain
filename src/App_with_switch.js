import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
const app = new Clarifai.App({apiKey: 'a5e8f5d16b474133a234b917b0900dee'})
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

class App extends Component {
    constructor() {
        super()
        this.state = {
            input: '',
            imageUrl: '',
            box: [],
            route: '',
            isSignedIn: false
        }
    }

    onInputChange = event => {
        this.setState({input: event.target.value});
    }

    onKeyUp = (e) => {
      if (e.keyCode === 13) {
          this.buttonSubmit();
      }
    }

    buttonSubmit = () => {
      const { input, imageUrl } = this.state;
      this.setState({imageUrl: input}, () => {
        app.models.predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
        .then( response => this.displayFaceBox(this.calcImageBox(response)))
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
    		this.setState({isSignedIn: false})
    	} else if (route === 'home') {
    		this.setState({isSignedIn: true})
    	}
    	this.setState({route: route});
    }

    render() {
      const { isSignedIn, route, box, imageUrl } = this.state;
       return (
          <div className="App">
            <Particles className='particles' params={particleOptions} />
            <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
		        { /* To use switch(){} in render() function, wrap in a self involing function as below ie (()=>{swith(..){..}})(), 
            	Or create function that has the switch and call it in the render() function */
            	(() => {switch (route) {
            		case 'home':
            			return (
            				<div>
		        					<Logo />
		                  <Rank />
		                  <ImageLinkForm 
		                     inputChange={this.onInputChange} 
		                     buttonSubmit={this.buttonSubmit}
		                     keyUp={this.onKeyUp}/>
		                  <FaceRecognition faceBox={box} faceImage={imageUrl}/>
		                </div>
                	);
                case 'signin':
                	return <SignIn onRouteChange={this.onRouteChange} />;
                case 'register':
                	return <Register onRouteChange={this.onRouteChange} />;
                default:
                	return <Register onRouteChange={this.onRouteChange} />;
            	}})()
        
            }
          </div>
        );
    }
 
}

export default App;

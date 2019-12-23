import React from 'react';
import FaceBoxSingle from './FaceBoxSingle.js';
import './FaceRecognition.css';
const FaceRecognition = ({faceImage, faceBox}) => {
	return (
		<div className="center ma">
			<div className="absolute mt2">
				<img id='face' alt='' src={faceImage} />
				{
					faceBox.map(myFace => {
						return	(
							<FaceBoxSingle 
								key={myFace.id} 
								top={myFace.topRow} 
								right={myFace.rightCol} 
								bottom={myFace.bottomRow} 
								left={myFace.leftCol} />
						)
					})
				}
				
				
			</div>
		</div>
	);
}

export default FaceRecognition;
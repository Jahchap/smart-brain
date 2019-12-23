import React from 'react';

const FaceBoxSingle = ({top, right, bottom, left}) => {
	return (
		<div className="bounding-box" 
			style={{ 
				top: top, 
				right: right, 
				bottom: bottom, 
				left: left }}></div>
	)
}

export default FaceBoxSingle;
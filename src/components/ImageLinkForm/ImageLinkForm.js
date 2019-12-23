import React from 'react';
import './ImageLinkForm.css';
const ImageLinkForm = ({inputChange, pictureSubmit, keyUp}) => {
	return (
		<div>
			<p className="f4">
				{'This magic Brain will detect faces in your photo'}
			</p>
			<div className="center">
				<div  className='pa4 br3 shadow-5 form center'>
					<input 
						className="f4 pa2 w-70 center" 
						type="search" 
						onChange={inputChange}
						onKeyUp={keyUp} />
					<button onClick={pictureSubmit} className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">Detect</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm;
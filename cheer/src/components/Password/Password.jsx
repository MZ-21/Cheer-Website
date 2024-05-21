import './Password.css';
import React, {useState, useEffect} from 'react';

export const Password = ({ onPasswordChange }) => {
    const [password, setPassword] = useState([]);
    const [blackCircleCount, setBlackCircleCount] = useState(0);
    const [hidden, setHidden] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        onPasswordChange(password);
      }, [password, onPasswordChange]);

    // adds pictures to password
    const handleButtonClick = (event) => {
        // limit password to 5 images
        if(blackCircleCount < 5){
            // display images in password field
            const src = event.currentTarget.querySelector('img').src;
            setPassword((prevPassword) => {
                onPasswordChange(password);
              return  [...prevPassword, src.slice(22)];
            });
            setBlackCircleCount((prevCount) => prevCount + 1);         
            setErrorMessage('');
        }
        else{
            setErrorMessage('Maximum 5 pictures');
        }
    }

    // removes pictures from password
    const handleBackspaceClick = () => {
        setPassword((prevPassword) => {
            const updatedPassword = prevPassword.slice(0, -1);
            onPasswordChange(password);
            return updatedPassword;
        });
        setErrorMessage('');
        if (blackCircleCount > 0) {
            setBlackCircleCount((prevCount) => prevCount - 1);
          }
    };

    // toggles eye-icon
    const handleHideClick = () => {
        setHidden((prevHidden) => !prevHidden);
    }

    return(
        <>
            <p className='error'>{errorMessage}</p>
            <div className="pass-input"> 
                <p className='input-identifier'>Password:</p>
                <div className="pwd">
                    {hidden
                    ? Array.from({ length: blackCircleCount }).map((_, index) => (
                        <div key={index} className="black-circle"></div>
                        ))
                    : password.map((src, index) => (
                        <img key={index} src={src} alt={`Password Image ${index + 1}`} />
                        ))}
                    <img
                    src={hidden ? 'password_images/eye-password-hide.svg' : 'password_images/eye-password-show.svg'}
                    alt="eye icon"
                    className="eye-icon"
                    onClick={handleHideClick}
                    ></img>
                </div>
            </div>
            <div className='pwd-box'>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/angry.svg' alt='angry face'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/grinning.svg' alt='grinning face'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/halo.svg' alt='smiley face with halo'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/heart-shaped-eyes.svg' alt='smiley face with heart shaped eyes'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/nerd.svg' alt='nerd face'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/partying.svg' alt='partying face'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/slightly-smiling.svg' alt='slightly smiley face'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/sunglasses.svg' alt='smiley face with sunglasses'></img>
                </div>
                <div className='box' onClick={handleButtonClick}>
                    <img src='password_images/thinking.svg' alt='thinking face'></img>
                </div>
                <div className='bottom'>
                    <div className='box' onClick={handleButtonClick}>
                        <img src='password_images/winking.svg' alt='winking face with tongue sticking out'></img>
                    </div>
                    <div className='box backspace' onClick={handleBackspaceClick}>
                        <img src='password_images/backspace.svg' alt='backspace button'></img>
                    </div>
                </div>
            </div>
        </>
    )
}
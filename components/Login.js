import styles from '../styles/Login.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';



function Login() {

    const dispatch = useDispatch(); 
    const router = useRouter()

    const [isOpenRegister, setIsOpenRegister] = useState(false)
    const [isOpenLogin, setIsOpenLogin] = useState(false)

    const [signUpUsername, setSignUpUsername] = useState('')
    const [signUpPassword, setSignUpPassword] = useState('')
    const [signInUsername, setSignInUsername] = useState('')
    const [signInPassword, setSignInPassword] = useState('')
    const [error, setError] = useState('')

    const user = useSelector((state) => state.user.value);
    const validUser = user.token

    const handleRegister = () => {
        fetch('http://localhost:3000/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: signUpUsername, password: signUpPassword }),
            })
            .then(response => response.json())
            .then(data => {
                setError(data.error);
                if (data.result) {
                    dispatch(login({ token: data.token, id: data.id, createdSpaces: data.createdSpaces, visitedSpaces: data.visitedSpaces }));
                    setSignUpUsername('');
                    setSignUpPassword('');
                    setIsOpenRegister(false);
                    router.push(`/user/${data.id}`)
                }
            });
    } 

    const handleLogin = () => {
        fetch('http://localhost:3000/users/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userName: signInUsername, password: signInPassword }),
		})
        .then(response => response.json())
        .then(data => {
            setError(data.error);
            if (data.result) {
                dispatch(login({ token: data.token, id: data.id, createdSpaces: data.createdSpaces, visitedSpaces: data.visitedSpaces }));
                setSignInUsername('');
                setSignInPassword('');
                setIsOpenLogin(false)
                router.push(`/user/${data.id}`)
            }
        });
    }

    const handleClose = () => {
        setIsOpenRegister(false);
        setIsOpenLogin(false);
        setSignUpUsername('');
        setSignUpPassword('');
        setSignInUsername('');
        setSignInPassword('');
        setError('');
    };

    useEffect(()=>{
        if(error){
            setError('')
        }
    },[signInUsername, signInPassword, signUpUsername, signUpPassword])

    let modalRegister = (
        <div className={styles.modal} onClick={(event) => { event.stopPropagation(); handleClose(); }}>
            <div className={styles.modallogin} onClick={(event)=> event.stopPropagation()}>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <h2>Create an account</h2>
                    <h2>
                        <FontAwesomeIcon onClick={() => handleClose()} icon={faXmark} className={styles.modalclose} />
                    </h2>
                </div>
                <div>
                    <input className={styles.modalinput} type="text" placeholder="Email" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
                    <input className={styles.modalinput} type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
                    <p style={{margin: '0', height: '15px', fontSize: '12px'}}>
                        {error}
                    </p>
                    <button className={styles.bluebutton} id="register" onClick={() => handleRegister()}>Register</button>
                </div>
            </div>
        </div>
    );

    let modalLogin = (
        <div className={styles.modal} onClick={(event) => { event.stopPropagation(); handleClose(); }}>
            <div className={styles.modallogin} onClick={(event)=> event.stopPropagation()}>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <h2>Sign in gorá</h2>
                    <h2>
                        <FontAwesomeIcon onClick={() => handleClose()} icon={faXmark} className={styles.modalclose} />
                    </h2>
                </div>
                <div>
                    <input className={styles.modalinput} type="text" placeholder="Email" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
                    <input className={styles.modalinput} type="password" placeholder="Password" id="sigInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
                    <p style={{margin: '0', height: '15px', fontSize: '12px'}}>
                        {error}
                    </p>
                    <button className={styles.bluebutton} id="register" onClick={() => handleLogin()}>Login</button> 
                </div>
            </div>
        </div>
    );
   
    return (
    <div className={styles.container}>
        {isOpenLogin && modalLogin}
        {isOpenRegister && modalRegister}
        <div className={styles.login}>
                <h1 className={styles.title}>g◍rá</h1>
                <h3 className={styles.subtitle}>Let's create a gorá space..</h3>
                {!validUser && <>
                    <button className={styles.bluebutton} type="primary" onClick={()=>setIsOpenRegister(true)}>
                        SignUp
                    </button>
                    <button className={styles.button} type="primary" onClick={()=>setIsOpenLogin(true)}>
                        SignIn
                    </button>
                </>}
                {validUser && 
                    <button className={styles.button} type="primary" onClick={()=> {router.push(`/user/${user.id}`)}}>
                        My profile
                    </button>
                }
        </div>
    </div>
    );
}

export default Login;

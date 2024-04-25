import { useRouter } from 'next/router';
import styles from '/styles/User.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faCheck, faPlus, faSignOutAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '/reducers/user';
import { useState } from 'react';
import { addSpace, trashSpace, trashVisitSpace } from '../../reducers/user';


function User() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const validUser = user.token

    const handleLogout = () => {
		dispatch(logout());
        router.push('/')
	};

    // create new space
    const [ newSpace, setNewSpace ] = useState(false);
    const [ spaceName, setSpacename ] = useState('');
    const newSpaceModal = 
    <div onClick={(e) => {setNewSpace(false)}} style={{position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,.8)'}}>
        <div onClick={(e) => {e.stopPropagation()}} style={{position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50vw', height: '20vh', top: '20vh', left: '25%', zIndex: 10, borderRadius: '10px', backgroundColor: 'mediumpurple'}}>
            <h2>Name your new space</h2>
            <div style={{display: 'flex'}}>
                <input className={styles.modalinput} type="text" placeholder="A gorá space" id="nameOfYourSpace" onChange={(e) => setSpacename(e.target.value)} value={spaceName} />
                <button className={styles.button} onClick={() => handleNewSpace()}><FontAwesomeIcon style={{fontSize: '20px'}} icon={faPlus}/></button>
            </div>
        </div>
    </div>



    const handleNewSpace = () => {
        fetch('https://gora-back.vercel.app/spaces/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ spaceName: spaceName, token: user.token }),
		})
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                let space = data.space
                if(!space.ground.length) space.ground = '/floor.png';
                if(!space.foreground.length) space.foreground = '/foreground.png';
                if(space.walls = []) space.walls = '/walls.json';
                dispatch(addSpace(space));
                setNewSpace(false);
                setSpacename('');
                // router.push(``) vers mapmaker
            }
        });
    };

       
    // delete a space
    const [ trashModal, setTrashModal ] = useState(false);
    const [ spaceToDelete, setSpaceToDelete ] = useState();


    const validationModal = 
    <div onClick={(e) => {setTrashModal(false)}} style={{position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,.8)', zIndex: 3}}>
        <div onClick={(e) => {e.stopPropagation()}} style={{position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50vw', height: '20vh', top: '20vh', left: '25%', zIndex: 10, borderRadius: '10px', backgroundColor: 'mediumpurple'}}>
            <h2>Are you sure to delete this space ?</h2>
            <div style={{display: 'flex'}}>
                <button className={styles.button} onClick={() => setTrashModal(false)}><FontAwesomeIcon style={{fontSize: '20px'}} icon={faCancel}/></button>
                <button className={styles.button} onClick={() => handleTrashSpace()}><FontAwesomeIcon style={{fontSize: '20px'}} icon={faCheck}/></button>
            </div>
        </div>
    </div>



    const handleTrash = (e) => {
        setTrashModal(true);
        let target = e.target;
        while (target.tagName !== "DIV") {
            target = target.parentNode;
        }
        setSpaceToDelete(target)
    }

    const handleTrashSpace = () => {

        fetch('https://gora-back.vercel.app/spaces/trash', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _id: spaceToDelete.id, token: user.token }),
		})
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                dispatch(trashSpace(spaceToDelete.id));
                dispatch(trashVisitSpace(spaceToDelete.id));
                setSpaceToDelete();
                setTrashModal(false)
            }
        });
    };
 
    let created = user.createdSpaces.map((e,i) =>
        <div key={i} className={styles.miniature} style={{backgroundImage: `url(${e.ground})`}}>
            <div id={e._id} onClick={(event) => router.push(`/space/${event.target.id}/${e.name}`)} className={styles.space}>
                <p id={e._id} style={{textAlign: 'center', fontSize: '1.1em', color: 'whitesmoke', margin: '0'}}>{e.name}</p>
            </div>
            <div className={styles.trash} id={e._id} onClick={(e) => handleTrash(e)}>
                <FontAwesomeIcon id="trash-icon" style={{fontSize: '10px'}} icon={faTrash}/>
            </div>
        </div>
    )

    let visited = user.visitedSpaces.map((e,i) =>
        <div key={i} className={styles.miniature} style={{backgroundImage: `url(${e.ground})`}}>
            <div id={e._id} onClick={(event) => router.push(`/space/${event.target.id}/${e.name}`)} className={styles.space}>
                <p id={e._id} style={{color: 'whitesmoke', margin: '0'}}>{e.name}</p>
            </div>
        </div>
    )

    const invalidUser = 
    <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontSize: '48px'}}>404</div>
      <div>Oups.. you seem to be nowhere.</div>
    </div>

    return (
        <div style={{background: 'linear-gradient(blueviolet, mediumpurple)', width: '100vw', height: '100vh', display: 'flex'}}>
            
            
            <div className={styles.menu}>
                <h1 className={styles.title} onClick={()=>router.push("/")}>g◍rá</h1>

                {user && <div style={{display: 'flex'}}>
                    <button onClick={()=>{handleLogout()}} className={styles.button}>
                        <FontAwesomeIcon style={{fontSize: '20px'}} icon={faSignOutAlt}/>
                        <div className={styles.tooltip}>Logout</div>
                    </button>
                </div>}
            </div>

            {validUser && <div style={{margin: '10vw'}}>
                <div>
                    <h2 style={{color: 'whitesmoke', opacity: .8, }}>Created spaces</h2>
                    <div style={{display: 'flex', width: '80vw', flexWrap: 'wrap'}}>
                        {created}
                        <div onClick={() => setNewSpace(true)} className={styles.space} style={{width: '150px'}}>
                        <p style={{color: 'whitesmoke', margin: '0'}}><FontAwesomeIcon style={{fontSize: '20px'}} icon={faPlus}/></p>
                        </div>
                        {newSpace && newSpaceModal}
                        {trashModal && validationModal}
                    </div>

                    {user.visitedSpaces.length > 0 && <h2 style={{color: 'whitesmoke', opacity: .8, marginTop: '5vw'}}>Visited spaces</h2>}
                    <div style={{display: 'flex', width: '80vw', flexWrap: 'wrap'}}>
                        {visited}
                    </div>
                </div>
            </div>}
            {!validUser && invalidUser}
        </div>
    );
}

export default User;

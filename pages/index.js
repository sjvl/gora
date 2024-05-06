import Login from '../components/Login';

function Index() {
    return (
        <div>
          <Login />
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', padding: '15vh 0'}}>
            <p style={{width: '40vw', fontSize: '18px'}}>
              Just as the agora was as a central hub for learning, discourse, and community engagement in antiquity, 
              Gorá aims to enhance this ethos in the digital age.
            </p>
            <p style={{width: '40vw', fontSize: '18px'}}>
              From the bustling campuses of traditional education to the virtual agora of today, 
              Gorá is a solution tailored to foster dynamic online learning environments. 
              It embodies the spirit of collaboration, dialogue, and intellectual exchange that characterized historical agoras 
              while harnessing the power of modern technology to transcend geographical boundaries.
            </p>

          </div>
        </div>
    );
}

export default Index;

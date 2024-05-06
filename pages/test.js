import Space from '../components/Space';

function Test() {

  const handleSave = () => {
    console.log('save')
    // const formData = new FormData();
    
    fetch('http://localhost:3000/upload', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ imageDataUrl: imgURI })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      console.log(data.url)
      // dispatch(addPhoto(data.url));
    });
  };


  return(
    <div>
      <button onClick={()=>handleSave()}>
        SEND
      </button>
    </div>
  );
}

export default Test;

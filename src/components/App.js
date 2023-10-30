import Header from "./Header"
import PetPage from "./PetPage"
import {useState, useEffect} from "react"

function App() {

  const [searchText, setSearchText] = useState("")
  const [formData, setFormData] = useState({
    likes: 0
  })
  const [pets, setPets] = useState([])

  useEffect(() => {
    fetch("http://localhost:4000/pets")
    .then(response => response.json())
    .then(petData => setPets(petData))
  }, [])

  const filteredPets = pets.filter(pet => {
    if(searchText === ""){
      return true
    }
    return pet.name.toUpperCase().includes(searchText.toUpperCase())
  })

  function adoptPet(id){
    setPets(pets.filter(pet => {
      return pet.id !== id
    }))
  }

  function addPet(event){
    event.preventDefault()

    fetch("http://localhost:4000/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(newPet => setPets([...pets, newPet]))
  }
  

  function updateFormData(event){
    setFormData({...formData, [event.target.name]: event.target.value})
  }

  function updatePet(pet){
    fetch(`http://localhost:4000/pets/${pet.id}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body:JSON.stringify({likes: pet.likes+1})
    })
    .then(res=>res.json())
    .then(inf=> {
      const newPets=pets.map(p=>{
        if(p.id===inf.id) return inf;
        return p; 
      })
      setPets(newPets)
    })
  }

  return (
    <div className="app">
      <Header />
      <PetPage updatePet={updatePet} pets={filteredPets} setSearchText={setSearchText} adoptPet={adoptPet} addPet={addPet} updateFormData={updateFormData} />
    </div>
  );
}

export default App;
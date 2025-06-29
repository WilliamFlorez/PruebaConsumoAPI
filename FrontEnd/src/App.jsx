import { useState } from 'react'
import reactLogo from './assets/react.svg'

const changeFrase = (props) =>{
      console.log("|| Cambio de frase||")
    }

   const changeIMG = (props) =>{
      console.log("|| Cambio de imagen||")
    }
function App() {
  const [count, setCount] = useState(0)

   


  return (
    <>
      <div>
        <table>
          <tr>
              <th>FRASE</th>
              <th>IMAGEN</th>
          </tr>
          <tr>
              <td></td>
              <td>Maria Anders</td>
          </tr>
          <tr>
              <td><button onClick={changeFrase()}>Cambiar frase</button></td>
              <td><button onClick={changeIMG()}>Cambiar imagen</button></td>            
          </tr>
        </table>

      </div>
    </>
  )
}

export default App

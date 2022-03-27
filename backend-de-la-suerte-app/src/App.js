import './App.css';
import {
  createClient
} from '@supabase/supabase-js'
import {
  useState,
  useEffect
} from 'react'
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmojiCard } from './components/EmojiCard';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


const App = () => {
    const [loading, setLoading] = useState(false)
    const [emojis, setEmojis] = useState([])
    const [scene, setScene] = useState(1)
    const [partidaStarted, setPartidaStarted] = useState(false)
    const [partida, setPartida] = useState({})
    const [currentAttempts, setCurrentAttempts] = useState(-1)
    const [maxAttempts, setMaxAttempts] = useState(-1)
    const [maxAttemptsReached, setMaxAttemptsReached] = useState(false)
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [currentCat, setCurrentCat] = useState({})
    const [currentCatId, setCurrentCatId] = useState(0)
    const [attemptSummary, setAttemptSummary] = useState([])

    // Para que cargue solo una vez los primeros emojis
    useEffect(() => {
      if(currentAttempts>0){


        if(currentAttempts === maxAttempts){
          setMaxAttemptsReached(true)
          getSummaryOfAttempts()

        }
          getCategoryById(currentCat.nextCategory).then(cat => {

            getEmojisByCat(cat.id).then(response => {
              setLoading(false)
            })
  
          })

      }
    }, [currentAttempts,maxAttempts])

    useEffect(() => {
      if(maxAttemptsReached){
        getEmojisByCat(partida.id_categoriafinal)
      }
    }, [maxAttemptsReached])


    const getCategoryById = async (catId) => {
      try {
        let {
          data,
          error,
          status
        } = await supabase
          .from('categorias')
          .select('*')
          .eq('id', catId)
          

        if (error && status !== 200) {
          throw error
        }
        if (data) {
          setCurrentCat(data[0])
          console.log(data[0])
          return data[0]
        }
      } catch (error) {
        alert(error.message)
      } finally {
        
      }
    }

    const getSummaryOfAttempts = async () => {

      try {
        let { data: attempts, error } = await supabase
        .from('intentos')
        .select(`
          *,
          emoji_db (
            *
          )
        `).eq('id_partida', partida.id)

        if (error) {
          throw error
        }
        if (attempts) {
          console.log(attempts)
          let emojis_list =  []
          attempts.forEach(attempt => {
            emojis_list.push(attempt.emoji_db)


          })
          setAttemptSummary(emojis_list)


        }
      } catch (error) {
        alert(error.message)
      } finally {
        
      }

      
    }


    const getEmojisByCat = async (catId) => {
      console.log('getEmojisByCat '+catId)
      try {

        let {
          data,
          error,
          status
        } = await supabase
          .from('emoji_db')
          .select('*')
          .eq('categoria', catId)
          .order('id', {
            ascending: true
          })

        if (error && status !== 200) {
          throw error
        }

        if (data) {
          
          setEmojis(data)
          return data;
        }
      } catch (error) {
        console.log(error.message)
      } finally {

      }
    }

    const updateNumberOfAttempts = async () => {

      try {
        setLoading(true)

        let {
          data,
          error,
          status
        } = await supabase
          .from('intentos')
          .select('*')
          .eq('id_partida', partida.id)
              

        if (error && status !== 200) {
          throw error
        }

        if (data) {
          console.log({'CurrentAttempts':data.length})
          setCurrentAttempts(data.length)

        }
      } catch (error) {
        alert(error.message)
      } finally {
      }


    }
    const picar = (idEmoji) =>{
      if(!maxAttemptsReached){
      registrarPicado(idEmoji).then(picados => {
        console.log(picados)
        updateNumberOfAttempts(partida.id)
      })
    }
    }



    const registrarPicado = async (idEmoji) => {
      try {
        setLoading(true)
        const {
          data,
          error
        } = await supabase
          .from('intentos')
          .insert([{
            id_partida: partida.id,
            id_emoji: idEmoji
          }])

        if (error !== null) {
          throw error
        }

        if (data) {
          return data
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    const iniciarPartida = () => {

      if(userName===''||userPassword===''){
        alert('Por favor introduce usuario y contraseña')
        return 
      }



      setLoading(true)
      registrarUsuario().then(userData => {

        console.log({'response':userData})
        registrarPartida(userData.id).then(response => {
          getCategoryById(response.id_categoriaInicial).then(catResponse => {
            setCurrentCat(catResponse)
            setCurrentCatId(catResponse.id)
            getEmojisByCat(catResponse.id).then(response => {
              setLoading(false)
            })
            
          })


            
        })
      })
      

    }
    const registrarUsuario = async () => {
      // Registro el usuario
      try {
        const {
          data,
          error
        } = await supabase
          .from('mineros')
          .insert({'userName':userName, 'userPassword':userPassword})
        if (error != null) {
          throw error
        }
        if(data){
          console.log({'data':data})
          return data[0]
        } 
        
      } catch (error) {
        alert(error)
      } finally {
      }



    }




    const registrarPartida = async (userId) => {
      try {
        const {
          data,
          error
        } = await supabase
          .from('partidas')
          .insert({'id_minero':userId})
        if (error !== null) {
          throw error
        }
        if(data){
          console.log(data)
          setPartidaStarted(true)
          console.log({'id_partida':data[0].id})
          setPartida(data[0])
          setMaxAttempts(data[0].maxAttempts)
          setMaxAttempts(data[0].maxAttempts)
          return data[0]
        } 
        
      } catch (error) {
        console.log(error.message)
      } finally {
      }



    }
    



    if (loading) {
      return ( <LoadingSpinner></LoadingSpinner> )
    }
    if(!partidaStarted){
      return <div className='container'><h1>¡Hola {userName.length !== 0 && userName}{userName.length === 0 && 'Malandrín'}!</h1><p>Para empezar a picar, primero debes decirme tu nombre y después haz click en <strong>empezar</strong></p><p>En esta pequeña aventurilla, deberás ir eligiendo tu camino, para encontrar el preciado tesoro...</p>
      <p className="red">Los campos son obligatorios para empezar</p>

      <div className='loginForm'>
      <input required value={userName} onInput={e => setUserName(e.target.value)} type="text" name="userName" placeholder="Paquito el minero"></input>
      <input required value={userPassword} onInput={e => setUserPassword(e.target.value)} type="password" name="userPassword" placeholder="1234"></input>
      <button onClick={() => iniciarPartida()}>¡Empezar a picar! ⛏</button>
      </div>
      </div>
    }


    return ( 
      <div className='container'>
        <h1>{currentCat.titulo.replace("%userName%", userName)}</h1>
        <ul className = 'listado-emojis' > {
        emojis.map((emoji) => ( <li className = ''
          key = {emoji.id} > 
          <EmojiCard emoji={emoji} onClickCallback={() => picar(emoji.id)}></EmojiCard>
          </li>
        ))
      } </ul>

      {maxAttemptsReached &&
      <div className='container'>
        <p>El recorrido que has elegido ha sido:</p>
        <ul className = 'listado-emojis' > {
        attemptSummary.map((emoji) => ( <li className = ''
          key = {emoji.id} > 
          <EmojiCard emoji={emoji} onClickCallback={() => picar(emoji.id)}></EmojiCard>
          </li>
        ))
      } </ul>
    </div>

    } 
    </div>
    )
    }



    export default App
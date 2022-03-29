import './App.css';
import { supabase } from './supabase';

import {
  useState,
  useEffect
} from 'react'
import { LoadingSpinner } from './components/LoadingSpinner';
import { Auth } from './components/Auth';
import { Account } from './components/Account';
import { EmojiCard } from './components/EmojiCard';




const App = () => {
    const [loading, setLoading] = useState(false)
    const [emojis, setEmojis] = useState([])
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
    const [session, setSession] = useState(null)
    const [numeroPartidas, setNumeroPartidas] = useState(0)

    useEffect(() => {
      setSession(supabase.auth.session())
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])


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

    useEffect(() => {
      if(session){
        getNumeroPartidas()
      }
    }, [session])

    
    const showLoading = async (showLoading) => {
      setLoading(showLoading)

    }


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
    const reIniciarPartida = () => {
      getNumeroPartidas()

      setPartidaStarted(false)
      setMaxAttemptsReached(false)
    }


    const iniciarPartida = () => {

      setMaxAttemptsReached(false)


      setLoading(true)
      

        registrarPartida(supabase.auth.user().id).then(response => {
          getCategoryById(response.id_categoriaInicial).then(catResponse => {
            setCurrentCat(catResponse)
            setCurrentCatId(catResponse.id)
            getEmojisByCat(catResponse.id).then(response => {
              setLoading(false)
            })
            
          })


            
        })

      

    }


    // Make a function that gets the number of registers in table partidas for a user id
    const getNumeroPartidas = async () => {
      console.log('getNumeroPartidas')
      try {
        const {
          data,
          error
        } = await supabase
          .from('partidas')
          .select('*')
          .eq('id_user', supabase.auth.user().id)
        if (error !== null) {
          throw error
        }
        if(data){
          console.log(data.length)
          setNumeroPartidas(data.length)
        } 
        
      } catch (error) {
        console.log(error.message)
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
          .insert({'id_user':userId})
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
      return <div className='container'><h1>¡Hola {!session ? 'Malandrín' : session.user.email}!</h1>
      {!session ? <div><p>Para empezar esta aventura debes inscirbirte como minero, eligiendo un <strong>email</strong> y una <strong> contraseña</strong> después haz click en <strong>registrar</strong>.</p><p>O puedes <strong>Iniciar sesión</strong> si ya estás registrado.</p></div> : <div><h3>¡Bienvenido!</h3><p>Cuando estés listo puedes hacer click en <strong>Empezar a picar</strong></p><p>Has jugado un total de <strong>{numeroPartidas}</strong> partidas</p> </div> }
      <div className='loginForm'>
        {!session ? <Auth showLoading={showLoading} /> : 
          <div>
          <button className='start' onClick={() => iniciarPartida()}>¡Empezar a picar! ⛏</button>
          <Account key={session.user.id} session={session} />
        </div>      
        }
    
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

      <button className='restart' onClick={() => reIniciarPartida()}>¡Volver a inicio! ⛏</button>
    </div>

    } 
    </div>
    )
    }



    export default App
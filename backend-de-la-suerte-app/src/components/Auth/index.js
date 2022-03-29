import { useState } from 'react'
import { supabase } from '../../supabase';
import { LoadingSpinner } from  '../LoadingSpinner';


export const Auth = (props) => {


  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (e) => {

    try {
      props.showLoading(true)
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      props.showLoading(false)
    }
  }




  const handleLogin = async (e) => {

    try {
      props.showLoading(true)
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      props.showLoading(false)
    }
  }
  if (loading) {
    return ( <LoadingSpinner></LoadingSpinner> )
  }
  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget" aria-live="polite">
        {loading ? (
          'Sending magic link...'
        ) : (
          <form className='loginForm'>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              className="inputField"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button block" aria-live="polite" onClick={() => handleRegister()}>
              Registrar
            </button>
            <button className="button block" aria-live="polite" onClick={() => handleLogin()}>
              Iniciar sesión
            </button>            
          </form>
        )}
      </div>
    </div>
  )
}
import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cafeAPI from "../api/cafeAPI";
import { LoginData, LoginResponse, RegisterData, RegisterResponse, Usuario } from "../interfaces/appInterfaces";
import { authReducer, AuthState } from "./authReducer";

type AuthContextProps = {
  errorMessage:string;
  token:string|null;
  user:Usuario|null;
  status:'checking'|'authenticated'|'not-authenticated';
  signUp:(RegisterDataProps:RegisterData)=>void;
  signIn:(LoginDataProps:LoginData)=>void;
  logOut:()=>void;
  removeError:()=>void;
}

const authInitialState:AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: ''
}

//como luce mi context
export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}:any) => {

  const [ state, dispatch ] = useReducer(authReducer, authInitialState)

  useEffect(() => {
    checkToken()
  }, [])
  
  const checkToken = async() => {
    const token = await AsyncStorage.getItem('token');
    //no token, no autenticado
    if(!token) return dispatch({type:'notAuthenticated'})
    //hay token
    const resp = await cafeAPI.get('/auth')
    if(resp.status !== 200){
      return dispatch({type:'notAuthenticated'})
    }
    await AsyncStorage.setItem('token', resp.data.token)
    dispatch({
      type:'signUp', 
      payload:{
        token: resp.data.token,
        user: resp.data.usuario
      }
    })
  }

  const signUp = async({ nombre, correo, password, rol }:RegisterData) => {
    try {
      const { data } = await cafeAPI.post<RegisterResponse>('/usuarios', { nombre, correo, password, rol })
      dispatch({
        type:'signUp', 
        payload:{
          token: data.token,
          user: data.usuario
        }
      })
      await AsyncStorage.setItem('token', data.token)
    } catch (error:any) {
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Revise la información'
      })
    }
  }

  const signIn = async({correo, password}:LoginData) => {
    try {
      const { data } = await cafeAPI.post<LoginResponse>('/auth/login', {correo, password});
      dispatch({
        type:'signUp', 
        payload:{
          token: data.token,
          user: data.usuario
        }
      })
      await AsyncStorage.setItem('token', data.token)
    } catch (error:any) {
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Informacióm incorrecta'
      })
    }
  }

  const logOut = async() => {
    await AsyncStorage.removeItem('token');
    dispatch({type:'logOut'})
  }

  const removeError = () => {
    dispatch({type:'removeError'})
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      signUp,
      signIn,
      logOut,
      removeError
    }}>
      { children }
    </AuthContext.Provider>
  )
}



import { useContext, useEffect, useState } from 'react';
import HeaderCollettiva from '../components/HeaderCollettiva';
import supabase from '../supabase';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { AttivitaContext } from '../components/AttivitàContext';
import { Skeleton } from '@chakra-ui/react';

export default function DomandeGuida() {

    const { user, loading } = useContext(UserContext);
    const { attività, loadingAttività} = useContext(AttivitaContext)
   
    const navigate = useNavigate()

    useEffect(() => {
      //se non c'è una sessione attiva, vai a Login (se non sta caricando e non c'è utente in localStorage: monitoro cambiamenti su loadin, user e navigate: 
      //se loagind diventa false e user è null, utente non è autenticato e viene eseguita navigazione a login)
      if (!user && !loading) {
          return (
              //<p>Accesso non effetuato</p>
              navigate('/Login')
          )
      }
    }, [loading, user, navigate])

    //se sta caricando i dati dell'attività
    if (loadingAttività) {
        return (
            <>
             <div className='h-screen flex items-center justify-center'>
                <Skeleton startColor='#00FFFF' endColor='orange.500' height='20px' />
             </div>
            </>
           )
    }

    return (
     <>
        <HeaderCollettiva titolo = "Domande guida" paginaPrecedente = ""/>
      
     </>
    );
}
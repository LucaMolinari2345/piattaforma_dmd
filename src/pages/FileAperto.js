import { Image, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import HeaderCollettiva from '../components/HeaderCollettiva';
import { UserContext } from '../components/UserContext';

export default function FileAperto() {

  const { user, loading } = useContext(UserContext);

  const navigate = useNavigate()

  //recupero il file passato e la pagina da cui ho aperto il file per tornare indietro, e il titolo che sarà passato all'header
  let stateData = useLocation()
  stateData=stateData.state
  console.log(stateData);
  let file = stateData["file"]
  let paginaPrec = stateData['paginaPrec']
  console.log(file);
  console.log(paginaPrec);
  let titoloHeader = stateData['titoloHeader']
  console.log(titoloHeader);

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

  if (file.indexOf(".pdf") != -1) {
    return (
      <>
        <HeaderCollettiva titolo = {titoloHeader} paginaPrecedente = {paginaPrec} />
        <div className='h-dvh'>
          <iframe src={file} className=' w-full h-full' />
        </div>
      </>
    ) 
  } else {
      return (
          <>
            <HeaderCollettiva titolo = {titoloHeader} paginaPrecedente = {paginaPrec} />
            <VStack>
               <Image src={file} />
            </VStack>
          </>
        )
  }

  
}

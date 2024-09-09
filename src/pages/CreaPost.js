import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { AttivitaContext } from '../components/AttivitàContext';
import { Avatar, Box, Button, Image, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import supabase from '../supabase';
import MathEditor from '../components/MathEditor';
// import "//unpkg.com/mathlive";

export default function CreaPost() {

  const { user, userInfo, loading } = useContext(UserContext); 
  const { attività, loadingAttività} = useContext(AttivitaContext)

  const [textPost, setTextPost] = useState('')
  //const [immagine, setImmagine] = useState(null)
  const [immagini, setImmagini] = useState([])
  const [loadingInsert, setLoadingInsert] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)

  // const [valueMath, setValueMath] = useState("");


  let stateData = useLocation()
  stateData=stateData.state
  //console.log(stateData);
  let paginaPrec = stateData['paginaPrec']
  //console.log(paginaPrec);
  let rispostaA = stateData['rispostaA']
  console.log(rispostaA);
  let idPostDocenteIniziale = stateData['idPostDocenteIniziale']
  console.log(idPostDocenteIniziale);
  let nomeThread = paginaPrec.substring(paginaPrec.lastIndexOf('/') +1)
  nomeThread = nomeThread.replace(/%20/g, ' ')
  //console.log(nomeThread);

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

 
    //se sta caricando i dati dell'attività o utente
    if (loadingAttività || loading) {
        return (
            <>
             <div className='h-screen flex items-center justify-center'>
                <Skeleton startColor='#00FFFF' endColor='orange.500' height='20px' />
             </div>
            </>
           )
    }

    if (!userInfo) {
      return (
          <>
           <div className='h-screen flex items-center justify-center'>
              <Skeleton startColor='#00FFFF' endColor='orange.500' height='20px' />
           </div>
          </>
         )
    }

    async function pubblicaPost() {
      //controllo se c'è almeno un allegato o del testo, altrimenti ritorno alert con messaggio errore (per ora vedo solo testo)
      if (!textPost && immagini.length == 0) {
        alert("inserisci del testo o un'immagine prima di pubblicare un post");
      } else {
        if (!rispostaA) {
          //console.log('questo non è risposta, aggiungo post con post padre = id post docente. Testo: ' , textPost ? textPost : null); 
          await insertPost(idPostDocenteIniziale)        
        } else {
          //console.log('questo è risposta, aggiungo post con post padre = rispostaA. Testo: ', textPost ? textPost : null);
          await insertPost(rispostaA)
        }
      }
    }

    async function insertPost(idPadre) {
      console.log('creato post in risposta a ', idPadre);
      console.log('testo post: ', textPost);

      if (attività && user) {

          setLoadingInsert(true)

          const { data, error } = await supabase
          .from('POST')
          .insert([
            { 
              testo: textPost ? textPost : null, 
              autore: userInfo.email,
              thread: nomeThread,
              attività: attività.id,
              post_padre: idPadre 
            },
          ])
          .select() //ritorna la riga appena inserita; si può omettere
          .single()

          if (error) {
            console.error('Errore nella query:', error);
            setTextPost('')
          } else {
            console.log('post inserito:', data);
            setTextPost('')
            if (immagini.length > 0) {
              await uploadFotoBucket(data)
            }
            setImmagini([])
          }
        setLoadingInsert(false);
        navigate(-1) 
      }
    }

    async function uploadFotoBucket(postNuovo) {

      for (const immagine of immagini) {
        const  result = await supabase
          .storage
          .from('allegati-post')
          .upload(immagine.nome, immagine.fileBucket)

          if (result) {
            console.log('result di uploadBucket: ', result);
            console.log('data di result: ', result.data);
            await uploadAllegatiPost(postNuovo, result)
          } else {
            console.log('errore in upload bucket');
          }
      }
          
                                   
    }

    async function uploadAllegatiPost(postNuovo, result) {

      const { data, error } = await supabase
      .from('ALLEGATO_POST')
      .insert([
        { post: postNuovo.id,
          file: process.env.REACT_APP_SUPABASE_URL + '/storage/v1/object/public/allegati-post/' + result.data.path
        },
      ])
      .select()

      if (error) {
        console.error('Errore nella query:', error);
      } else {
        console.log('allegato inserito: ', data);
      }

    } 


    function aggiungiFoto(e) {

      console.log(e.target.files);
      if (e.target.files) {
        setUploadingImg(true)
        const files = e.target.files    
        const immagini = Array.from(files).map(file => ({
          immagine: URL.createObjectURL(file),
          nome: Date.now() + '_' + file.name,
          fileBucket: file
        }))   
         setImmagini(immagini)
       }

      setUploadingImg(false)
      console.log('immagini: ', immagini);

    }

    function togliFoto(immagine) {
       setUploadingImg(true)
       setImmagini(immagini.filter(img => img.immagine !== immagine));
       setUploadingImg(false)      
    }


  return (
    <>

    <div className='h-screen'>  {/* border-solid border-2 border-blue-500 */}
    
        <nav className=" mb-8 mt-5 ">
            <div className=' flex justify-between items-center'>
              <Link to={paginaPrec}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </Link>

              { loadingInsert ? 
                  <Button bg={'#AFEFEA'} fontSize='16px' color={'black'} height={'40px'} width={'96px'} borderRadius={'full'} isLoading >Pubblica</Button> 
                    :
                  <Button bg={'#AFEFEA'} fontSize='16px' color={'black'} height={'40px'} width={'96px'} borderRadius={'full'} onClick={() => pubblicaPost()}>Pubblica</Button> 
              }

            </div>
        </nav>

        <div className='flex min-h-36 gap-3 mb-3'>   {/* border-solid border-2 border-yellow-500*/}      
          <Avatar size="sm" name={userInfo.username} src={userInfo.immagine_profilo}/>
          <textarea className=' w-full border-transparent min-h-full' placeholder='Scrivi qualcosa...' value={textPost} onChange={e => setTextPost(e.target.value)}></textarea>
          {/* <math-field 
      onInput={evt => setValueMath(evt.target.value)}
    > {valueMath} </math-field> */}
    {/* <MathEditor></MathEditor> */}

        </div>

        {uploadingImg && (         
            <SkeletonCircle size='10' />     
        )}


        {immagini && (
        <div className=' flex flex-wrap gap-4'>
            {immagini.map((immagine) => 
            
            <div className='flex'>
              <Image src={immagine.immagine} w={'auto'} h={'180px'} borderRadius='25' />    {/* className='border-solid border-2 border-blue-500' */}
              <div className='-ml-5  w-6 h-6 ' onClick={() => togliFoto(immagine.immagine)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            )   }
        </div>  
        )} 

        <div className=' flex gap-5 items-center bottom-5 mt-10'>
          <div>
            <label>
              <input type="file" id="picture" name="picture" accept="image/*"  className=' hidden' multiple onChange={aggiungiFoto}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </label>
          </div>
          <div>
            <label>
              <input type="file" id="picture" name="picture" accept="image/*" capture="environment"  className=' hidden' multiple onChange={aggiungiFoto}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </label>
          </div>
        </div>

    </div>
      
    </>
  )
}

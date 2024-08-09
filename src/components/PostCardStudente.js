import { Avatar, Divider, Heading, Image, Skeleton, Text, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react'
import CommentiPostStudente from './CommentiPostStudente';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import supabase from '../supabase';

export default function PostCardStudente(props) {

    const { userInfo } = useContext(UserContext);
    const [likes, setLikes] = useState([]);
    const [loadingL, setLoadingL] = useState(true)

    //console.log(user.id);
   // console.log('risposta primo livello: ', props.post);

    const isLikeByMe =  !!likes.find(like => like.utente == userInfo.email) //il '!!' converte il risultato in un boolean

    //metto/tolgo like ad un post studente di primo livello
    function toggleLikePost() {
        if (isLikeByMe) {
            //alert('già messo like')
            removeLike()
        } else {
            //alert('metto like')
            insertLike()
        }
    }

    //metto tupla in LIKE_POST con utente = a email dell'utente attivo e post = a id post attuale
    async function insertLike() {
        const { error } = await supabase
            .from('LIKE_POST')
            .insert({
                post: props.post.id,
                utente: userInfo.email
            })

        if (error) {
            console.error('Errore nella query insertLike:', error);
        } else {
            //alert('like messo')
            fetchLikes()
        }

    }

    //rimuovo tupla in LIKE_POST con utente = a email dell'utente attivo e post = a id post attuale
    async function removeLike() {
        const { error } = await supabase
            .from('LIKE_POST')
            .delete()
            .eq('post', props.post.id)
            .eq('utente', userInfo.email)

        if (error) {
            console.error('Errore nella query insertLike:', error);
        } else {
            fetchLikes()
        }
    }


    //prendo i record di LIKE_POST che contengono l'id del post attuale
    async function fetchLikes() {
        let { data: likes, error } = await supabase
            .from('LIKE_POST')
            .select("*")
            .eq('post', props.post.id)

        if (error) {
            console.error('Errore nella query:', error);
            setLikes(null);
        } else {
           // console.log("like per post ", props.post.id, ' : ' ,likes);
            setLikes(likes);
        }
    }

    useEffect(() => {

        try {
            setLoadingL(true)
            fetchLikes()
        } catch (error) {
            console.error('Errore nel caricamento dei dati:', error);
            setLikes(null);
        } finally {   //qualunque sia il risultato del try, il blocco finally viene eseguito e imposta a false lo stato di caricamento
            setLoadingL(false);
        }

    }, [])
    
    if (loadingL) {
        return <Skeleton startColor='#00FFFF' endColor='orange.500' height='20px' />;
    }

    if (!props.post) {
        return <div>Commento non disponibile</div>;
    }

  // se post non ha allegati
  if (props.post.ALLEGATO_POST.length == 0) {
    return (
     <>
        <div style={{marginBottom: '12px'}} className='flex'>               
            <Avatar size="sm" name={props.post.UTENTE.username} src={props.post.UTENTE.immagine_profilo}/>
            <div className=' py-2 px-4 grow'>
                <Heading size='xs' mb={'4px'} fontFamily={'Roboto Mono'}>{props.post.UTENTE.username}</Heading> 
                <div className=' flex items-center'>
                        <Text fontSize='xs'>{props.post.testo}</Text>
                        <div className=' flex gap-2 justify-end grow ml-4'>
                            <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <Text fontSize='10px'>{likes.length}</Text>
                            </div>
                        </div>
                </div>                            
               
                <div className=' flex items-center mt-2'> {/* border-solid border-2 border-indigo-600    */} 
                    <Link to={'/CreaPost'} state={{paginaPrec: props.urlThread, rispostaA: props.post.id}}>          
                        <Text fontSize='10px' color='#275F90'>Rispondi</Text>
                    </Link>
                </div>
            </div>
        </div>
        <div className=' pl-9 '> {/* border-solid border-2 border-indigo-600 */}  

            {
                props.risposte.map(commento => (
                    <CommentiPostStudente commento = {commento} urlThread={props.urlThread}/>
                ))
            }
            
        </div>
        <Divider borderColor='#000000' borderWidth='1px' mt={'5px'} opacity={0.2}/><br />
     </>
    )

  // se post ha solo un allegato (testo + 1 foto, o solo 1 foto senza testo)
  } else if (props.post.ALLEGATO_POST.length == 1) { 

    return (
        <>
           <div style={{marginBottom: '12px'}} className='flex'>               
               <Avatar size="sm" name={props.post.UTENTE.username} src={props.post.UTENTE.immagine_profilo}/>
               <div className=' py-2 px-4 grow'>
                   <Heading size='xs' mb={'4px'} fontFamily={'Roboto Mono'}>{props.post.UTENTE.username}</Heading>  
                   <div className=' flex items-center'>
                        <Text fontSize='xs'>{props.post.testo}</Text>
                        <div className=' flex gap-2 justify-end grow ml-4'>
                            <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <Text fontSize='10px'>{likes.length}</Text>
                            </div>
                        </div>
                   </div>                  
                   
                   <VStack>
                    <Link to={`/FileAperto`} state={{file: props.post.ALLEGATO_POST[0].file, paginaPrec: props.urlThread, titoloHeader: "Threads"}}>        
                        <Image src={props.post.ALLEGATO_POST[0].file} maxW='160px' maxH='auto' borderRadius='25' mt={'10px'} mb={'20px'} /> 
                    </Link>  
                   </VStack>
                   <div className=' flex items-center mt-2'> {/* border-solid border-2 border-indigo-600    */}           
                       <Link to={'/CreaPost'} state={{paginaPrec: props.urlThread, rispostaA: props.post.id}}>          
                            <Text fontSize='10px' color='#275F90'>Rispondi</Text>
                       </Link>
                       {/* <div className=' flex gap-2 justify-end grow'>                     
                           <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                               </svg>
                               <Text fontSize='10px'>{likes.length}</Text>
                           </div>
                           <div className=' flex items-center gap-1'>
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                               </svg>
                               <Text fontSize='10px'>{props.risposte.length}</Text>
                           </div>
                       </div> */}
                   </div>
               </div>
           </div>
           <div className=' pl-9 '> {/* border-solid border-2 border-indigo-600 */} 

               {
                    props.risposte.map(commento => (
                        <CommentiPostStudente commento = {commento} urlThread={props.urlThread}/>
                    ))
               }

           </div>
           <Divider borderColor='#000000' borderWidth='1px' mt={'5px'} opacity={0.2}/><br />
        </>
       )

  // se post ha più allegati
  } else {

    return (
        <>
           <div style={{marginBottom: '12px'}} className='flex'>               
               <Avatar size="sm" name={props.post.UTENTE.username} src={props.post.UTENTE.immagine_profilo}/>
               <div className=' py-2 px-4 grow'>
                   <Heading size='xs' mb={'4px'} fontFamily={'Roboto Mono'}>{props.post.UTENTE.username}</Heading>  
                   <div className=' flex items-center'>
                        <Text fontSize='xs'>{props.post.testo}</Text>
                        <div className=' flex gap-2 justify-end grow ml-4'>
                            <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <Text fontSize='10px'>{likes.length}</Text>
                            </div>
                        </div>
                   </div>                           

                    <div className=' grid grid-cols-2 gap-4 mt-[30px]'> 
                        {/* ciclo sull'array degli allegati del post, e per ognuno ritorno un elemento Immagine */}
                        {
                            props.post.ALLEGATO_POST.map(allegato => (
                            <VStack>
                                <Link to={`/FileAperto`} state={{file: allegato.file, paginaPrec: props.urlThread, titoloHeader: "Threads"}}>        
                                    <Image src={allegato.file} maxH='150px' borderRadius='45' /> 
                                </Link>   
                            </VStack>
                            ))
                        }
                    </div>

                   <div className=' flex items-center mt-2'> {/* border-solid border-2 border-indigo-600    */}           
                       <Link to={'/CreaPost'} state={{paginaPrec: props.urlThread, rispostaA: props.post.id}}>          
                            <Text fontSize='10px' color='#275F90'>Rispondi</Text>
                       </Link>
                       {/* <div className=' flex gap-2 justify-end grow'>                       
                           <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                               </svg>
                               <Text fontSize='10px'>{likes.length}</Text>
                           </div>
                           <div className=' flex items-center gap-1'>
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                               </svg>
                               <Text fontSize='10px'>{props.risposte.length}</Text>
                           </div> 
                       </div> */}
                   </div>
               </div>
           </div>
           <div className=' pl-9 '> {/* border-solid border-2 border-indigo-600 */}   

               {
                    props.risposte.map(commento => (
                        <CommentiPostStudente commento = {commento} urlThread={props.urlThread}/>
                    ))
               }

           </div>
           <Divider borderColor='#000000' borderWidth='1px' mt={'5px'} opacity={0.2}/><br />
        </>
       )
 
  }   
  

}


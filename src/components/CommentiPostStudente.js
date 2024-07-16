import { Avatar, Heading, Image, Skeleton, Text, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import supabase from '../supabase';

export default function CommentiPostStudente(props) {
  
    console.log('risposta secondo livello: ', props.commento);

    const { userInfo } = useContext(UserContext);
    const [likes, setLikes] = useState([]);
    const [loadingL, setLoadingL] = useState(true)


    const isLikeByMe =  !!likes.find(like => like.utente == userInfo.email) 

    //metto/tolgo like ad un post studente di primo livello
    function toggleLikePost() {
        if (isLikeByMe) {
            removeLike()
        } else {
            insertLike()
        }
    }

    //metto tupla in LIKE_POST con utente = a email dell'utente attivo e post = a id post attuale
    async function insertLike() {
        const { error } = await supabase
            .from('LIKE_POST')
            .insert({
                post: props.commento.id,
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
            .eq('post', props.commento.id)
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
            .eq('post', props.commento.id)

        if (error) {
            console.error('Errore nella query:', error);
            setLikes(null);
        } else {
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

    if (!props.commento) {
        return <div>Commento non disponibile</div>;
    }

    if (props.commento.ALLEGATO_POST.length == 0) {

        return (
            <>
                <div className=' flex'>
                    <Avatar size="sm" name={props.commento.UTENTE.username} src={props.commento.UTENTE.immagine_profilo}/>
                    <div className=' py-2 px-4 grow'>
                        <Heading size='xs' mb={'4px'} fontFamily={'Roboto Mono'}>{props.commento.UTENTE.username}</Heading>                    
                        <Text fontSize='xs'>{props.commento.testo}</Text>
                        <div className=' flex justify-end mt-2'> {/* border-solid border-2 border-indigo-600    */}                                  
                            <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <Text fontSize='10px'>{likes.length}</Text>
                            </div>                                 
                        </div>
                    </div>
                </div>
            </> 
        );

    } else if (props.commento.ALLEGATO_POST.length == 1) {
            
        return (
            <>
                <div className=' flex'>
                    <Avatar size="sm" name={props.commento.UTENTE.username} src={props.commento.UTENTE.immagine_profilo}/>
                    <div className=' py-2 px-4 grow'>
                        <Heading size='xs' mb={'4px'} fontFamily={'Roboto Mono'}>{props.commento.UTENTE.username}</Heading>                    
                        <Text fontSize='xs'>{props.commento.testo}</Text>
                        <VStack>
                            <Link to={`/FileAperto`} state={{file: props.commento.ALLEGATO_POST[0].file, paginaPrec: props.urlThread, titoloHeader: "Threads"}}>        
                                <Image src={props.commento.ALLEGATO_POST[0].file} maxW='160px' maxH='auto' borderRadius='25' mt={'10px'} mb={'20px'} /> 
                            </Link>  
                        </VStack>
                        <div className=' flex justify-end mt-2'> {/* border-solid border-2 border-indigo-600    */}                                  
                            <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <Text fontSize='10px'>{likes.length}</Text>
                            </div>                    
                        </div>
                    </div>
                </div>
            </>            
        );    

    } else {  // se post ha più allegati
            
        return (
                <>
                    <div className=' flex'>
                        <Avatar size="sm" name={props.commento.UTENTE.username} src={props.commento.UTENTE.immagine_profilo}/>
                        <div className=' py-2 px-4 grow'>
                            <Heading size='xs' mb={'4px'} fontFamily={'Roboto Mono'}>{props.commento.UTENTE.username}</Heading>                    
                            <Text fontSize='xs'>{props.commento.testo}</Text>

                            <div className=' grid grid-cols-2 gap-4 mt-[30px]'> 
                                {/* ciclo sull'array degli allegati del post, e per ognuno ritorno un elemento Immagine */}
                                {
                                    props.commento.ALLEGATO_POST.map(allegato => (
                                    // <Image src={allegato.file} borderRadius='45' />
                                    <VStack>
                                        <Link to={`/FileAperto`} state={{file: allegato.file, paginaPrec: props.urlThread, titoloHeader: "Threads"}}>        
                                            <Image src={allegato.file} maxH='150px' borderRadius='45' /> 
                                        </Link>   
                                    </VStack>
                                    ))
                                }
                            </div>

                            <div className=' flex justify-end mt-2'> {/* border-solid border-2 border-indigo-600    */}                                  
                                <div className=' flex items-center gap-1' onClick={() => toggleLikePost()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={"size-3 " + (isLikeByMe ? 'fill-red-500' : '')}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                    <Text fontSize='10px'>{likes.length}</Text>
                                 </div>                              
                            </div>
                        </div>
                    </div>
                </>                      
        )
    }
                
}
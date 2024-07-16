import { useContext, useEffect, useState } from 'react';
import HeaderCollettiva from '../components/HeaderCollettiva';
import supabase from '../supabase';
import { Box, Divider, Flex, Skeleton } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import PostCardDocente from '../components/PostCardDocente';
import PostCardStudente from '../components/PostCardStudente';
import FooterThread from '../components/FooterThread';
import { UserContext } from '../components/UserContext';
import { AttivitaContext } from '../components/AttivitàContext';

export default function ThreadDocente() {

    const { user, userInfo, loading } = useContext(UserContext);
    const { attività, loadingAttività} = useContext(AttivitaContext)

    //console.log('user sessione: ', user);
    //console.log('user info: ', userInfo);

    const navigate = useNavigate()  
    const { titolo } = useParams()
    const url = window.location.href;

    const [post, setPost] = useState([]);
    const [loadingT, setLoadingT] = useState(true)
    
    async function fetchPost() {

        if (attività) {
            let { data: post, error } = await supabase  //UTENTE!POST_autore_fkey invece di UTENTE perchè ho 2 relazioni tra le stesse entità post e utente: devo specificare quale delle due relazioni mi interessa
            .from('POST')
            .select(`
                *,  
                UTENTE!POST_autore_fkey (   
                    *
                    ),
                ALLEGATO_POST ( 
                    *
                    )       
            `)
            .eq('attività', attività.id)
            .eq('thread', `${titolo}`)

            if (error) {
                console.error('Errore nella query:', error);
                setPost(null);
            } else {
                //console.log("Post:", post);
                setPost(post);
            }
            setLoadingT(false);
        }    
     
    }

    useEffect(() => {

        if (!loadingAttività && attività) {
            try {
                setLoadingT(true)
                fetchPost()
            } catch (error) {
                console.error('Errore nel caricamento dei dati:', error);
                setLoadingT(false); 
            } 
        }   
    }, [loadingAttività, attività])
    

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


    if (loadingT || loadingAttività) {
        return <Skeleton startColor='#00FFFF' endColor='orange.500' height='20px' />;
    }

    if (!post || post.length === 0) {
        return (
            <>
                <HeaderCollettiva titolo="Threads" paginaPrecedente="/" />
                <Box align="center">
                    <p>Errore nel caricamento dei dati</p>
                </Box>
            </>
        );
    }

     //recupero il post iniziale del docente del thread
     const postDocente = post.find((post) => post.post_padre == null)

    //controllo che ci sia almeno il post iniziale nel thread
    if (postDocente === undefined) {
        return (
        <>
            <HeaderCollettiva titolo = "Threads" paginaPrecedente = "/"/>
            <Box align="center">
                <p>Errore nel caricamento</p>
            </Box>
         </>
        )
    } 

    //post in risposta al post docente iniziale
    const postStudenti = post.filter(post => post.post_padre === postDocente.id)
    
    return (
     <>
        <HeaderCollettiva titolo = "Threads" paginaPrecedente = "/"/>
        <section>
            <Flex justifyContent='center' mb='30px'>
                <h2 className='text-[#275F90] text-2xl font-bold'>{titolo}</h2>
            </Flex>
            <Flex justifyContent='center'>
                <PostCardDocente post={postDocente} bgColor='#EBEBEB' urlThread={url}/>
            </Flex>            
            <Divider borderColor='#000000' borderWidth='1px' mt={'30px'} opacity={0.2}/><br />
             {
                postStudenti.map(postStudente => (
                    <PostCardStudente post = {postStudente} risposte = {post.filter(post => post.post_padre === postStudente.id)} urlThread={url} />
                ))
             }
        </section>
        <FooterThread urlThread={url} idPostDocenteIniziale = {postDocente.id}/>
     </>
    );
}



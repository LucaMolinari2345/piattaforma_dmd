import { useContext, useEffect, useState } from 'react';
import HeaderCollettiva from '../components/HeaderCollettiva';
import supabase from '../supabase';
import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import { UserContext } from '../components/UserContext';
import { AttivitaContext } from '../components/AttivitàContext';

export default function HomeElencoThreads() {

    const navigate = useNavigate()

    const { user, loading } = useContext(UserContext);
    const { attività, loadingAttività} = useContext(AttivitaContext)

    // console.log('user: ', user);
    // console.log('loading state: ', loading);

    //creo stato alla componente funzionale 
    const [threads, setThreads] = useState([]);
    const [loadingT, setLoadingT] = useState(true); //stato per il caricamento dei dati

    // async function per connettersi al database e recuperare i dati della tabella, aggiorno stato con array in risposta
    async function fetchData() {
    
            if (attività) {
                let { data: threads, error } = await supabase
                    .from('THREAD')
                    .select('*')
                    .eq('attività', attività.id);

                if (error) {
                    console.error('Errore nella query:', error);
                    setThreads([]);
                } else {
                    setThreads(threads);
                }
                setLoadingT(false);
            }    
    }

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

    //quando componente viene montata, richiama funzione fetchData
    useEffect(() => {
        if (!loadingAttività && attività) {
            try {
                setLoadingT(true);
                fetchData();
            } catch (error) {
                console.error('Errore nel caricamento dei dati:', error);
                setLoadingT(false); 
            }
        }
    }, [loadingAttività, attività]);


    //se sta caricando i dati da supabase, i dati della sessione o i dati dell'attività
    if (loadingT || loading ||loadingAttività) {
        return (
            <>
             <div className='h-screen flex items-center justify-center'>
                <Skeleton startColor='#00FFFF' endColor='orange.500' height='20px' />
             </div>
            </>
           )
    }

    if (!threads || !attività) {
        return (
                 <>
                    <HeaderCollettiva titolo = "Threads" paginaPrecedente = "/"/>
                    <Box align="center">
                        <p>Errore nel caricamento dell'attività.</p>
                    </Box>
                 </>
        )
    }


    //thread chat dell'attività
    let threadsChat = threads.filter(t => t.tipo === "thread chat")
    //console.log(threadsChat);

    //thread post docente dell'attività
    let threadsDocente = threads.filter(t => t.tipo === "thread post")
    //console.log(threadsDocente);

    return (
        <>
         <HeaderCollettiva titoloHome = "Threads" />           
         <section>
            <Flex flexDirection={'column'} >
                <div style={{marginBottom: '30px'}}>
                    <LinkCard titoloS="Soluzioni" link = "/Soluzioni" img={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                        }
                    />
                </div>
                <div style={{marginBottom: '30px'}}>
                    <h6 className=' text-center text-[#275F90] font-bold' style={{marginBottom: '10px'}}>Discussione di bilancio delle chat</h6>
                   
                    { threadsChat.length != 0 ? 
                        
                            threadsChat.map(thread => (
                                <LinkCard titolo = {thread.titolo} link = "/ThreadChat" img={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                    </svg>
                                    }
                                />
                            ))
                        

                        :

                        <>
                         {/* <div className=' flex justify-center my-10'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 384 512"><path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48h8V67c0 40.3 16 79 44.5 107.5L158.1 256 76.5 337.5C48 366 32 404.7 32 445v19H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8V445c0-40.3-16-79-44.5-107.5L225.9 256l81.5-81.5C336 146 352 107.3 352 67V48h8c13.3 0 24-10.7 24-24s-10.7-24-24-24H24zM192 289.9l81.5 81.5C293 391 304 417.4 304 445v19H80V445c0-27.6 11-54 30.5-73.5L192 289.9zm0-67.9l-81.5-81.5C91 121 80 94.6 80 67V48H304V67c0 27.6-11 54-30.5 73.5L192 222.1z"/></svg>
                         </div> */}
                         <p className=' italic text-sm text-center mb-10 mt-14'>Al momento non sono presenti discussioni di bilancio delle chat</p>
                        </>
                        
                    } 

                </div>
                <div style={{marginBottom: '30px'}}>
                    <h6 className=' text-center text-[#275F90] font-bold' style={{marginBottom: '10px'}}>Discussione di bilancio delle soluzioni</h6>
        
                    { threadsDocente.length != 0 ? 
                        
                        threadsDocente.map(thread => (
                            <LinkCard titolo = {thread.titolo} link = "/ThreadDocente" img={
                                <svg xmlns="http://www.w3.org/2000/svg" height={'36'} width={'36'} viewBox="0 0 640 512">
                                <path d="M192 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-8 384V352h16V480c0 17.7 14.3 32 32 32s32-14.3 32-32V192h56 64 16c17.7 0 32-14.3 32-32s-14.3-32-32-32H384V64H576V256H384V224H320v48c0 26.5 21.5 48 48 48H592c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H368c-26.5 0-48 21.5-48 48v80H243.1 177.1c-33.7 0-64.9 17.7-82.3 46.6l-58.3 97c-9.1 15.1-4.2 34.8 10.9 43.9s34.8 4.2 43.9-10.9L120 256.9V480c0 17.7 14.3 32 32 32s32-14.3 32-32z"/>
                                </svg>
                                }
                            />
                        ))
                    

                        :

                        <>
                        {/* <div className=' flex justify-center my-10'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 384 512"><path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48h8V67c0 40.3 16 79 44.5 107.5L158.1 256 76.5 337.5C48 366 32 404.7 32 445v19H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8V445c0-40.3-16-79-44.5-107.5L225.9 256l81.5-81.5C336 146 352 107.3 352 67V48h8c13.3 0 24-10.7 24-24s-10.7-24-24-24H24zM192 289.9l81.5 81.5C293 391 304 417.4 304 445v19H80V445c0-27.6 11-54 30.5-73.5L192 289.9zm0-67.9l-81.5-81.5C91 121 80 94.6 80 67V48H304V67c0 27.6-11 54-30.5 73.5L192 222.1z"/></svg>
                        </div> */}
                         <p className=' italic text-sm text-center mb-10 mt-14'>Al momento non sono presenti discussioni di bilancio delle soluzioni</p>
                        </>
                    
                    } 
                </div>
            </Flex>
         </section>
        </>
    );
}
import { useContext, useEffect, useState } from 'react';
import HeaderCollettiva from '../components/HeaderCollettiva';
import supabase from '../supabase';
import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Container, Divider, Flex, Grid, HStack, Heading, Image, Skeleton, Spacer, Text, VStack } from '@chakra-ui/react';
import CommentiSoluzione from '../components/CommentiSoluzione';
import { Link, useNavigate } from 'react-router-dom';
import SoluzioneCard from '../components/SoluzioneCard';
import { UserContext } from '../components/UserContext';
import { AttivitaContext } from '../components/AttivitàContext';

export default function Soluzioni() {

    const { user, loading } = useContext(UserContext);
    const { attività, loadingAttività} = useContext(AttivitaContext)

    const navigate = useNavigate()

    const [soluzioni, setSoluzioni] = useState([]);
    const [commenti, setCommenti] = useState([]);
    const [docente, setDocente] = useState([]);
    const [loadingS, setLoadingS] = useState(true)
    const [loadingC, setLoadingC] = useState(true)
    const [loadingD, setLoadingD] = useState(true)
    // const [end, setEnd] = useState(1);

    //async function per connettersi al database e recuperare i dati della tabella, aggiorno stato con array in risposta
    //prendo le soluzioni di tipo 'soluzione problema' dell'attività corrispondente
    async function fetchSoluzioni() {
            
        if (attività) {
            let { data: soluzioni, error } = await supabase
            .from('SOLUZIONE')
            .select('*')
            .eq('attività', attività.id)
            .eq('tipo', 'soluzione problema')

            if (error) {
                console.error('Errore nella query:', error);
                setSoluzioni([]);
            } else {
                // console.log("soluzioni:");
                // console.log(soluzioni);
                setSoluzioni(soluzioni);
            }
            setLoadingS(false);
        }
        
    }

    //prendo i commenti di ogni soluzione problema per l'attività corrispondente

    //ciao
    async function fetchCommenti() {

        if (attività) {
            let { data: commenti, error } = await supabase
            .from('COMMENTO_SOLUZIONE')
            .select(`
                 *,  
                 STUDENTE ( 
                    *, 
                    UTENTE ( * )
                    )        
            `)
            .eq('attività', attività.id)
            // .range(0, end)
            if (error) {
                console.error('Errore nella query:', error);
                setCommenti([]);
            } else {
                setCommenti(commenti);
            }
            setLoadingC(false);
        }
        
    }

    //recupero informazioni docente per card iniziale 
    async function fetchDocente() {
         
        if (attività) {
            let { data: docente, error } = await supabase
            .from('UTENTE')
            .select('*')
            .eq('email', attività.docente) 
            .single();

            if (error) {
                console.error('Errore nella query:', error);
                setDocente(null);
            } else {
                //console.log("Docente:", docente);
                setDocente(docente);
            }
            setLoadingD(false);
        }
           
    }
  
//     let start = 0;
//     let end = 1;

    // function mostraPiuCommenti() {
    //     console.log("end prima della somma: " + end);
    //     setEnd(end + 2)
       
    //     fetchCommenti(end)
    //      console.log("end dopo la somma: " + end);
    // }

    useEffect(() => {
        if (!loadingAttività && attività) {
            try {
                setLoadingS(true);
                fetchSoluzioni();
            } catch (error) {
                console.error('Errore nel caricamento dei dati:', error);
                setLoadingS(false); 
            }
        }
    }, [loadingAttività, attività]);

     useEffect(() => {
        if (!loadingAttività && attività) {
            try {
                setLoadingC(true)
                fetchCommenti()
            } catch (error) {
                console.error('errore nel caricamento dei dati: ', error);
                setLoadingC(false);
            } 
        }
       
    }, [loadingAttività, attività])  

    useEffect(() => {
        if (!loadingAttività && attività) {
            try {
                setLoadingD(true)
                fetchDocente()
            } catch (error) {
                console.error('errore nel caricamento dei dati: ', error);
                setLoadingD(false);
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

    if (loadingS || loadingC || loadingD || loadingAttività) {
        return (
            <Skeleton startColor='#00FFFF' endColor='orange.500' height='20px' />
           )
    }

    if (!soluzioni || !commenti || !docente || !attività) {
        return (
                 <>
                    <HeaderCollettiva titolo = "Threads" paginaPrecedente = "/"/>
                    <Box align="center">
                        <p>Errore nel caricamento dei dati</p>
                    </Box>
                 </>
        )
    }

    return (
     <>
        <HeaderCollettiva titolo = "Soluzioni" paginaPrecedente = "/"/>

        <section>

        <Card bg='#EBEBEB' borderRadius='45'>
            <CardHeader>
               <Flex gap='3'>
                  <Avatar size="sm" name={docente.username} src={docente.immagine_profilo}/>
                     <div className=' py-2'>
                        <Heading size='xs' fontFamily={'Roboto Mono'}>{docente.username}</Heading> 
                     </div>
               </Flex>          
            </CardHeader>
            <CardBody>
               <p>Qui sono elencate le soluzioni proposte dai vari gruppi rispetto alla domanda che è stata posta nella prima 
                fase dell'attività e le valutazioni della classe relative ad esse:</p>
               <VStack mt={'30px'} pl={'10px'} pr={'10px'}>
                  {/* <Link to={`/FileAperto`} state={{file: props.post.ALLEGATO_POST[0].file, paginaPrec: props.urlThread, titoloHeader: "Threads"}}>        
                     <Image src={props.post.ALLEGATO_POST[0].file} maxW='100%' maxH='auto' borderRadius='45' /> 
                  </Link>       */}
               </VStack>  
            </CardBody>
            <CardFooter />
         </Card>

         <Divider borderColor='#000000' borderWidth='1px' mt={'30px'} opacity={0.2}/><br />
            
            {
                 soluzioni.map(soluzione => (
                    <>
                        {/* <Flex style={{marginBottom: '10px'}} justifyContent={'center'}> */}
                        <Flex style={{marginBottom: '10px'}}>
                            {/* <h5 className="text-lg font-semibold">{"Soluzione " + soluzione.gruppo}</h5> */}
                            <h5 className="text-base font-semibold mb-3">{"Soluzione " + soluzione.gruppo}</h5>
                            {/* <Spacer />
                            <Button onClick={()=> mostraNascondiSoluzione(soluzione.tipo + " " + soluzione.gruppo + " " + soluzione.attività)}>X</Button> */}
                        </Flex>
                        <div id={soluzione.tipo + " " + soluzione.gruppo + " " + soluzione.attività}>
                            <Flex justify={'center'}>
                                <SoluzioneCard soluzione = {soluzione}></SoluzioneCard>
                            </Flex>
                            {/* <HStack style={{marginBottom: '20px'}} pl='24px' pr='24px' > */}
                            <HStack style={{marginBottom: '20px'}} pl='24px' pr='24px' justifyContent={'end'}>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                    <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                </svg>
                                <p>{soluzione.like}</p>                               
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                    <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                                </svg>
                                <p>{soluzione.dislike}</p> */}
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                </svg>
                                <Text fontSize='12px'>{soluzione.like}</Text>                              
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                                </svg>
                                <Text fontSize='12px'>{soluzione.dislike}</Text> 
                            </HStack>
                            {/* <Flex direction='column'> */}
                            <Flex direction='column' pl={'36px'}> 
                                {/* passo al componente che crea i commenti di una soluzione un array composto da solo i commenti fatti a quella soluzione */}
                                {/* ciclo sui commenti e per ognuno vedo se la soluzione a cui si riferisce è uguale alla soluzione che sto stampando ora, se si lo aggiungo all'array da passare al componente */}
                                <CommentiSoluzione commenti={commenti.filter(commento => commento.gruppo === soluzione.gruppo)} />
                            </Flex>
                            {/* <Flex justify={'center'} mt='10px' mb='15px'>
                                <Text fontSize='xs' as='u' color='#5699FF' onClick={ () => console.log("ciao")}>mostra di più</Text>
                            </Flex> */}
                        </div>
                        {/* <Divider borderColor='#275F90' borderWidth='1px'/><br /> */}
                        <Divider borderColor='#000000' borderWidth='1px' mt={'5px'} opacity={0.2}/><br />
                    </>
                ))
            }
        {/* <Button onClick={()=> mostraPiuCommenti()}>Mostra di più</Button>
        <Button onClick={()=> console.log(end)}>Mostra valore end</Button> */}
        </section>
     </>
    );
}
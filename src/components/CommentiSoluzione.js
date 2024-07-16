import { Avatar, Heading, Text } from "@chakra-ui/react";

export default function CommentiSoluzione(props) {
    
   //console.log(props.commenti);
   //console.log(props.commenti[0].STUDENTE.UTENTE.immagine_profilo);


    //ritorno una card con l'immagine del profilo se l'utente ce l'ha (altrimenti img standard), nome utente e il commento per quella soluzione
    return (
    <>
        {
            props.commenti.map(commento => (
                // <div style={{marginBottom: '10px'}} className='flex gap-2 '>   {/* border-solid border-2 border-indigo-600    */}            
                //     <Avatar size="sm" name={commento.STUDENTE.UTENTE.username} src={commento.STUDENTE.UTENTE.immagine_profilo}/>
                //     <div className='bg-gray-200 py-2 px-4 rounded-2xl grow'> {/* border-solid border-2 border-red-500  */} 
                //       <Heading size='xs'>{commento.STUDENTE.UTENTE.username}</Heading>                    
                //       <Text fontSize='xs'>{commento.commento}</Text>
                //     </div>
                // </div>
                <div style={{marginBottom: '10px'}} className='flex'>               
                    <Avatar size="sm" name={commento.STUDENTE.UTENTE.username} src={commento.STUDENTE.UTENTE.immagine_profilo}/>
                    <div className=' py-2 px-4 grow'>
                        <Heading size='xs' mb={'4px'} fontFamily={'Roboto Mono'}>{commento.STUDENTE.UTENTE.username}</Heading>                    
                        <Text fontSize='xs'>{commento.commento}</Text>
                    </div>
                </div>
            ))
        }

    </>
    );
}
import { Avatar, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Image, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function PostCard(props) {

//console.log(props.post);
//console.log(props.post.ALLEGATO_POST[0]); torna array perchè l'id del post potrebbe apparire in più tuple della tabella allegati, dato che lì non è PK e quindi si può ripetere
//console.log(props.urlThread)

  // se post non ha allegati
  if (props.post.ALLEGATO_POST.length == 0) {
      return (
         <Card bg='#EBEBEB' borderRadius='45'>
            <CardHeader>
               <Flex gap='3'>
                  <Avatar size="sm" name={props.post.UTENTE.username} src={props.post.UTENTE.immagine_profilo}/>
                     <div className=' py-2'>
                        <Heading size='xs' fontFamily={'Roboto Mono'}>{props.post.UTENTE.username}</Heading> 
                     </div>
               </Flex>          
            </CardHeader>
            <CardBody>
               <p>{props.post.testo}</p>
            </CardBody>
            <CardFooter />
         </Card>
      )
  // se post ha solo un allegato (testo + 1 foto, o solo 1 foto senza testo)
  } else if (props.post.ALLEGATO_POST.length == 1) { 
      return (
         <Card bg='#EBEBEB' borderRadius='45'>
            <CardHeader>
               <Flex gap='3'>
                  <Avatar size="sm" name={props.post.UTENTE.username} src={props.post.UTENTE.immagine_profilo}/>
                     <div className=' py-2'>
                        <Heading size='xs' fontFamily={'Roboto Mono'}>{props.post.UTENTE.username}</Heading> 
                     </div>
               </Flex>          
            </CardHeader>
            <CardBody>
               <p>{props.post.testo}</p>
               <VStack mt={'30px'} pl={'10px'} pr={'10px'}>
                  <Link to={`/FileAperto`} state={{file: props.post.ALLEGATO_POST[0].file, paginaPrec: props.urlThread, titoloHeader: "Threads"}}>        
                     <Image src={props.post.ALLEGATO_POST[0].file} maxW='100%' maxH='auto' borderRadius='45' /> 
                  </Link>      
               </VStack>  
            </CardBody>
            <CardFooter />
         </Card>
      )

  // se post ha più allegati 
  } else {
      return (
         <Card bg='#EBEBEB' borderRadius='45'>
            <CardHeader>
               <Flex gap='3'>
                  <Avatar size="sm" name={props.post.UTENTE.username} src={props.post.UTENTE.immagine_profilo}/>
                     <div className=' py-2'>
                        <Heading size='xs' fontFamily={'Roboto Mono'}>{props.post.UTENTE.username}</Heading> 
                     </div>
               </Flex>          
            </CardHeader>
            <CardBody>
               <>
                  <p>{props.post.testo}</p>
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
               </>
            </CardBody>
            <CardFooter />
         </Card>
      )
  }

}

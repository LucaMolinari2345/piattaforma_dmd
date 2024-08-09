import { Button, Card, CardBody, CardFooter, Image, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SoluzioneCard(props) {
 // console.log(props.soluzione);
  const fileUrl = props.soluzione.file;
  //creo oggetto url per lavorare con url
  const url = new URL(fileUrl)
  //estraggo il pathname dal url (.pathname mi restituisce il percorso del file senza il dominio)
  const pathName = url.pathname
  //estraggo il nome del file dal pathname (estraggo tutto quello che segue l'ultimo '/': substring mi ritorna i caratteri della stringa tra
  //due indici dati; se si dà solo un indice ritorna contenuto della stringa da quell'indice fino alla fine; l'indice che gli passo è lastindexof('/)
  //che mi ritorna la posizione dell'ultima occorrenza del carattere passato)
  const fileName = pathName.substring(pathName.lastIndexOf('/') +1)
  //console.log(fileName);

  if (props.soluzione.file.indexOf(".pdf") != -1) {
    // è pdf -> ritorno card per pdf
    return (
      <Card bg='#EBEBEB' style={{marginBottom: '40px'}} w='280px' h='280px' borderRadius='45' align={'center'} pt={'70px'}>
          <CardBody alignContent={'center'}>
            <VStack>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20" > 
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>             
                <p className=' text-center truncate max-w-32 hover:overflow-visible' >{fileName}</p>
             </VStack>             
          </CardBody>
          <CardFooter justifyContent={'center'} mt={'15px'}>
            <Link to={`/FileAperto`} state={{file: props.soluzione.file, paginaPrec: "/Soluzioni", titoloHeader: "Soluzioni"}}>
              <Button bg={'#AFEFEA'} fontSize='16px' color={'black'} height={'40px'} width={'92px'} borderRadius={'full'}>Apri</Button>
            </Link>       
          </CardFooter>
      </Card>
    )
  } else {
    //ritorno card per immagine
    return (
      <Card bg='#EBEBEB' style={{marginBottom: '40px'}} w='280px' h='280px' borderRadius='45'>
          <CardBody mt='-10px'>
              <Image w='263px' h='263px' src={props.soluzione.file} borderRadius='45' />
          </CardBody>
          <CardFooter justifyContent={'center'} mt='-55px'>
              <Link to={`/FileAperto`} state={{file: props.soluzione.file, paginaPrec: "/Soluzioni", titoloHeader: "Soluzioni"}}>
                  <Button bg={'#AFEFEA'} fontSize='16px' color={'black'} height={'40px'} width={'92px'} borderRadius={'full'}>Apri</Button>
              </Link>       
          </CardFooter>
      </Card>
    )
  }
}

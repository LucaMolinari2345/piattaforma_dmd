import { Button, Center, Grid } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Logout from "./Logout";

export default function HeaderCollettiva(props) {
    
    //ritorna l'header per ogni pagina della fase collettiva
    //L'header è formato dal titolo (che cambia di pagina in pagina) ed un pulsante indietro che riporta all'elenco thread (tranne per domande guida che riporta al thread nel quale le domande che sono state aperte sono contenute)


    //header per home con logout al posto di indietro
    if ('titoloHome' in props) {
      return(
        <nav className=" mb-8 mt-5">
            <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                <Logout />
                <Center><h5 className=" text-base font-bold text-[#275F90]">{props.titoloHome}</h5></Center>
            </Grid>
        </nav>
      );

    //header per le altre pagine
    } else {
      return(

        <nav className=" mb-8 mt-5">
            <Grid templateColumns='repeat(3, 1fr)' gap={6}>
              <Link to={props.paginaPrecedente}>
                <Button>Indietro</Button>
              </Link>
              <Center><h5 className=" text-base font-bold text-[#275F90]">{props.titolo}</h5></Center>
            </Grid>
        </nav>
      );
    }
    
}
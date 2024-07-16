import { Card, CardBody, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function LinkCard(props) {
    
    //LinkCard per soluzioni
    if ('titoloS' in props) {
        return (
        <>
            <Link to={props.link}>
                <Card style={{marginBottom: '10px'}} backgroundColor="#FDCF3D">
                    <CardBody>
                        <Flex alignItems='center'>
                            {props.img}
                            <Spacer />
                            <div className="w-3/5">
                                <h3 className="font-bold text-center">{props.titoloS}</h3>
                            </div>
                            <Spacer />
                            <div className=" flex justify-center items-center rounded-full overflow-hidden w-12 h-12 bg-white drop-shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </Flex>
                    </CardBody>
                </Card>
            </Link>
        </>
        );
    //LinkCard per Thread, dove ogni card porta al corrispettivo thread
    } else {
        return (
            <>
            <Link to={`${props.link}/${props.titolo}`}>
                <Card style={{marginBottom: '10px'}}>
                    <CardBody>
                        <Flex alignItems='center'>
                            {props.img}
                            <Spacer />
                            <div className="w-3/5">
                                <h3 className="font-bold text-center">{props.titolo}</h3>
                            </div>
                            <Spacer />
                            <div className=" flex justify-center items-center rounded-full overflow-hidden w-12 h-12 bg-white drop-shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>            
                        </Flex>
                    </CardBody>
                </Card>
            </Link>
        </>
        );
    }
    // return (
    //     <>
    //         <Link to={`${props.link}/${props.titolo}`}>
    //             <Card style={{marginBottom: '10px'}}>
    //                 <CardBody>
    //                     <HStack>
    //                         {/* <p>icona</p> */}
    //                         <h3>{props.titolo}</h3>
    //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    //                         </svg>
    //                     </HStack>
    //                 </CardBody>
    //             </Card>
    //         </Link>
    //     </>
        
    
    // );
}
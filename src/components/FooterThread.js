import { Button, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function FooterThread(props) {
  return (
    <div className=' bg-white shadow-[0_-5px_10px_rgb(220,220,220)] fixed bottom-0 ml-[-24px] mr-[-24px] h-10 flex justify-center items-center w-full bg-slate-500 h-12'>
        <Link to={'/CreaPost'} state={{paginaPrec: props.urlThread, idPostDocenteIniziale: props.idPostDocenteIniziale}}>         
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>         
        </Link>       
    </div>
  )
}

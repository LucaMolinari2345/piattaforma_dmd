import { Button } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabase'

export default function Logout() {

  let navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/Login')
  }

  return (
    <Button colorScheme='red' onClick={handleLogout}>Log out</Button>
  )
}

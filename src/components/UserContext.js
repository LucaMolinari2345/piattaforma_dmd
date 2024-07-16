import { createContext, useEffect, useState } from 'react';
import supabase from '../supabase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => 
    {
        const [user, setUser] = useState(null);
        const [userInfo, setUserInfo] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect( () => {
            // const session = supabase.auth.session();
            const getSession = async () => {
                setLoading(true)
                console.log('fetching...');
                const {data: { session }, error} = await supabase.auth.getSession();
                if (error) {
                    console.error("errore: " + error);
                } else {
                    console.log('session data: ', session);
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        fetchUserInfo(session.user.id)
                    }
                }
                setLoading(false)
            }

            const fetchUserInfo = async (userId) => {
                const { data, error } = await supabase
                    .from('UTENTE')
                    .select('*')
                    .eq('id', userId)
                    .single()

                if (error) {
                    console.error('errore nel fetch: ', error);
                } else {
                    console.log('user info: ', data);
                    setUserInfo(data)
                }
            }

            getSession();
            
            const {data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                console.log('auth state change: ', event, session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchUserInfo(session.user.id)
                } else {
                    setUserInfo(null)
                }
            }) 

            return () => {
                subscription.unsubscribe();
            }
        }, []);

        return (
            <UserContext.Provider value = {{user, setUser, userInfo, setUserInfo, loading}}>
                { children }
            </UserContext.Provider>
        )
    }

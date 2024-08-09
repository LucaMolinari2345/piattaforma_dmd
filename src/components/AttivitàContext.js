import { createContext, useEffect, useState } from "react";
import supabase from "../supabase";

export const AttivitaContext = createContext();

export const AttivitaProvider = ({ children }) => {
    const [attività, setAttività] = useState(null);
    const [loadingAttività, setLoadingAttività] = useState(true);

    async function fetchAttività() {
        let { data: attività, error } = await supabase
            .from('ATTIVITA')
            .select('*')
            .eq('id', 11)
            .single();

        if (error) {
            console.error('Errore nella query:', error);
            setAttività(null);
        } else {
            console.log("Attività:", attività);
            setAttività(attività);
        }
        setLoadingAttività(false);
    }

    useEffect(() => {
        fetchAttività();
    }, []);

    return (
        <AttivitaContext.Provider value={{ attività, loadingAttività }}>
            {children}
        </AttivitaContext.Provider>
    );
};

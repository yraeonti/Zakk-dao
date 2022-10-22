import {useContext, useReducer, createContext} from 'react'

import {Props, IContextState} from './interfaces'
import useWeb3 from '../hooks/web3'



const web3Context = createContext<IContextState>({
    treasuryBalance: "",
    numProposals: "",
    nftBalance: 0,
    setSelectedTab: () => {},
    executeProposal: () => new Promise((res, req) => {}),
    proposals: [],
    voteOnProposal: () => new Promise((res, req) => {}),
    loading: false,
    setFakeNftTokenId: () => {},
    createProposal: () => new Promise((res, req) => {}),
    selectedTab: "",
    fetchAllProposals: () => new Promise((res, req) => []) 

})


export const Web3Provider = ({ children } : Props) => {

    const {
        treasuryBalance,
        numProposals,
        nftBalance,
        setSelectedTab,
        executeProposal,
        proposals,
        voteOnProposal,
        loading,
        setFakeNftTokenId,
        createProposal,
        selectedTab,
        fetchAllProposals} = useWeb3()
    
        const value = {
            treasuryBalance,
             numProposals,
             nftBalance,
             setSelectedTab,
             executeProposal,
             proposals,
             voteOnProposal,
             loading,
             setFakeNftTokenId,
             createProposal,
             selectedTab,
             fetchAllProposals
        }


    return (
        <web3Context.Provider value={value}>
            {children}
        </web3Context.Provider>
    )
}

export const useProviderContext = () => {
    return useContext(web3Context)
}
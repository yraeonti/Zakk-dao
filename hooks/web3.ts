import {Contract, providers} from "ethers"
import React, { useEffect, useState, useRef } from "react"
import Web3Modal from "web3modal"
import {CRYPTODEVS_DAO_CONTRACT_ADDRESS, CRYPTODEVS_NFT_CONTRACT_ADDRESS, CRYPTODEVS_DAO_ABI, CRYPTODEVS_NFT_ABI} from "../constants"
import IProposal, {type proposalId} from "./interfaces"


export default function useWeb3 () {
    const [treasuryBalance, setTreasuryBalance] = useState<string>("0")

    const [numProposals, setNumProposals] = useState<string>("")

    const [proposals, setProposals] = useState<IProposal[]>([])

    const [nftBalance, setNftBalance] = useState<number>(0)

    const [fakeNftTokenId, setFakeNftTokenId] = useState<string>("");

    const [selectedTab, setSelectedTab] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const [walletConnected, setWalletConnected] = useState<boolean>(false);

    const web3ModalRef = useRef<Web3Modal | null>()

    const connectWallet = async(): Promise<void> => {
       try {
         await getProviderOrSigner()
         setWalletConnected(true)
       } catch (error) {
          console.error(error)
       }
    }

    const getProviderOrSigner = async (needSigner: boolean = false): Promise<providers.Web3Provider | providers.JsonRpcSigner> => {

         const provider = await web3ModalRef.current?.connect()
         const web3Provider = new providers.Web3Provider(provider)

         const {chainId} = await web3Provider.getNetwork()
         if (chainId !== 5) {
            window.alert("Please switch to the goerli network")
            throw new Error("Please switch to the goerli network")
         }

         if (needSigner) {
            const signer = web3Provider.getSigner()
            return signer
         }else {
            return web3Provider
         }
         
    }


   const getDaoContractInstance = (providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner): Contract => {
    return new Contract(
        CRYPTODEVS_DAO_CONTRACT_ADDRESS, 
        CRYPTODEVS_DAO_ABI,
        providerOrSigner
    )
   }

   const getCryptodevsNFTContractInstance = (providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner) => {
    return new Contract(
      CRYPTODEVS_NFT_CONTRACT_ADDRESS,
      CRYPTODEVS_NFT_ABI,
      providerOrSigner
    );
  };

   const getDAOTreasuryBalance = async (): Promise<void> => {
       try {
        const provider = await getProviderOrSigner()
        const balance = await provider.getBalance(
            CRYPTODEVS_DAO_CONTRACT_ADDRESS
        )
        setTreasuryBalance(balance.toString())
       } catch (error) {
        console.error(error);
        
       }
   }


    const getNumProposalsInDAO = async(): Promise<void> => {
      try {
        const provider = await getProviderOrSigner()
        const contract = getDaoContractInstance(provider)
        const daoNumProposals = await contract.numProposals()
        setNumProposals(daoNumProposals.toString())
      } catch (error) {
        console.error(error);
        
      }
    }


    const getUserNFTBalance = async(): Promise<void> => {
        try {
            const signer  = await getProviderOrSigner(true) as providers.JsonRpcSigner 
            const contract = getCryptodevsNFTContractInstance(signer)
            const balance = await contract.balanceOf(signer.getAddress())
            console.log(balance);
            
            setNftBalance(parseInt(balance.toString()))
            
        } catch (error) {
            console.error(error);
            
        }
        
        

    }

    const createProposal = async(): Promise<void> => {
        try {
            const signer = await getProviderOrSigner(true) as providers.JsonRpcSigner
            const contract = getDaoContractInstance(signer)
            const txn = await contract.createProposal(fakeNftTokenId)
            setLoading(true)
            await txn.wait()

            await getNumProposalsInDAO()
            setLoading(false)

        } catch (error: any) {
            console.error(error);
            window.alert(error.message)
        }
    }


    const fetchProposalById = async(id: number): Promise<IProposal | undefined> => {

        try {
          const provider = await getProviderOrSigner()
          const contract = getDaoContractInstance(provider)
          const proposal = await contract.proposals(id)

          const parsedProposal: IProposal = {
              proposalId: id,
              nftTokenId: proposal.nftTokenId.toString(),
              deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
              yayVotes: proposal.yayVotes.toString(),
              nayVotes: proposal.nayVotes.toString(),
              executed: proposal.executed
          }

          return parsedProposal
        } catch (error) {
            console.error(error);
            
        }


    }


    const fetchAllProposals = async(): Promise<IProposal[] | undefined > => {
      try {
        
        const proposals: IProposal[] = []
        
        for (let i = 0; i < Number(numProposals); i++) {
            const proposal = await fetchProposalById(i)
            proposals.push(proposal!)

            
        }
        setProposals(proposals)
        return proposals

      } catch (error) {
        console.error(error);
        
      }
    }

    const voteOnProposal = async (proposalId: proposalId, _vote: "YAY" | "NAY"): Promise<void> => {
        try {
            const signer = await getProviderOrSigner(true)
            const contract = getDaoContractInstance(signer)
            
            let vote = _vote === "YAY" ? 0 : 1

            const txn = await contract.voteOnProposal(proposalId, vote)
            setLoading(true)
            await txn.wait()
            setLoading(false)
            await fetchAllProposals()
        } catch (error: unknown) {
            console.log(error);
            // window.alert(error)
            
        }
    }

    const executeProposal = async (proposalId: proposalId): Promise<void> => {
        try {
            const signer = await getProviderOrSigner(true)
            const contract = getDaoContractInstance(signer)
            const txn = await contract.executeProposal(proposalId)
            setLoading(true)
            await txn.wait()
            setLoading(false)

            await fetchAllProposals()
        } catch (error: any) {
            console.error(error);
            window.alert(error.message)
        }
    }

    
    useEffect(() => {
        web3ModalRef.current = new Web3Modal({
            network: 'goerli',
            providerOptions: {},
            disableInjectedProvider: false
        })

        connectWallet().then(() => {
            getDAOTreasuryBalance()
            getUserNFTBalance()
            getNumProposalsInDAO()
        })
    }, [walletConnected])


    return {
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
}


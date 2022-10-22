import * as React from 'react'
import IProposal from '../hooks/interfaces'

export type Props = {
   children: React.ReactNode
}

type vote = "YAY" | "NAY"

export interface IContextState {
    treasuryBalance: string;
    numProposals: string;
    nftBalance: number;
    setSelectedTab: React.Dispatch<string>;
    executeProposal: (id: number) => Promise<void>;
    proposals: IProposal[];
    voteOnProposal: (proposalId: number, vote: vote ) => Promise<void>;
    loading: boolean;
    setFakeNftTokenId: React.Dispatch<string>;
    createProposal: () => Promise<void>;
    selectedTab: string;
    fetchAllProposals: () => Promise<IProposal[] | undefined>;
}
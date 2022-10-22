export default interface IProposal {
    proposalId: number;
    nftTokenId: number | string;
    deadline: Date;
    yayVotes: string;
    nayVotes: string;
    executed: boolean;
}

export type proposalId = number;
import {useProviderContext} from '../context/Web3Context'
import styles from '../styles/Home.module.css'


export default function ViewProposalTab() {
    
   const {loading, proposals, voteOnProposal, executeProposal} = useProviderContext()

    if (loading) {
      return (
        <div className={styles.description}>
            Loading... Waiting for transaction
        </div>
      )
    }else if (proposals.length === 0) {
        return (
            <div className={styles.description}>
             No proposals have been created
            </div>
        )
    }else {
        return (
          <div>
            {proposals.map((pros, index) => (
                <div key={index} className={styles.proposalCard}>
                   <p>Proposal ID: {pros.proposalId}</p>
                   <p>Fake NFT to Purchase: {pros.nftTokenId}</p>
                   <p>Deadline: {pros.deadline.toLocaleString()}</p>
                   <p>Yay Votes: {pros.yayVotes}</p>
                   <p>Nay Votes: {pros.nayVotes}</p>
                   <p>Executed?: {pros.executed.toString()}</p>
                   {pros.deadline.getTime() > Date.now() && !pros.executed ? (
                    <div className={styles.flex}>
                      <button
                      className={styles.button2}
                      onClick={() => voteOnProposal(pros.proposalId, "YAY")}
                      >
                      Vote YAY
                      </button>
                      <button
                      className={styles.button2}
                      onClick={() => voteOnProposal(pros.proposalId, "NAY")}
                      >
                       Vote NAY
                      </button>
                    </div>
                   ) : pros.deadline.getTime() < Date.now() && !pros.executed ? (
                       <div className={styles.flex}>
                        <button
                        className={styles.button2}
                        onClick={() => executeProposal(pros.proposalId)}
                        >
                          Execute Proposal{" "}
                          {pros.yayVotes > pros.nayVotes ? "(YAY)" : "(NAY)"}
                        </button>

                       </div>
                   ) : (
                      <div className={styles.description}>
                        Proposal Executed
                      </div>
                   )}
                </div>
            ))}
        </div>
        )
    }
}
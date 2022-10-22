import {useProviderContext} from '../context/Web3Context'
import styles from '../styles/Home.module.css'

export default function CreateProposalTab () {

    const {loading, nftBalance, setFakeNftTokenId, createProposal} = useProviderContext()

  
        if (loading) {
            return (
              <div className={styles.description}>
                Loading... Waiting for transaction...
              </div>
            );
          } else if (nftBalance === 0) {
            return (
              <div className={styles.description}>
                You do not own any CryptoDevs NFTs. <br />
                <b>You cannot create or vote on proposals</b>
              </div>
            );
          } else {
            return (
              <div className={styles.container}>
                <label>Fake NFT Token ID to Purchase: </label>
                <input
                  placeholder="0"
                  type="number"
                  onChange={(e) => setFakeNftTokenId(e.target.value)}
                />
                <button className={styles.button2} onClick={createProposal}>
                  Create
                </button>
              </div>
              )
            }
}